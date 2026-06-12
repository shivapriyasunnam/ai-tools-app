import { apiClient } from '@/src/services/apiClient';
import { createContext, useContext, useEffect, useState } from 'react';
import { embed } from '../services/ai/embeddings';
import { backfillNoteEmbeddings, deleteNoteVector, pruneOrphanedVectors, upsertNoteVector } from '../services/ai/vectorStore';

async function embedAndIndex(note) {
  const vector = await embed(note.text);
  await upsertNoteVector(note.id, vector, note.text);
}

export const QuickNotesContext = createContext();

export const QuickNotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    apiClient.get('/api/notes')
      .then(data => {
        setNotes(data);
        backfillNoteEmbeddings(data).catch(e => console.error('backfill failed', e));
        pruneOrphanedVectors(data).catch(e => console.error('prune failed', e));
      })
      .catch(() => setNotes([]));
  }, []);

  const addNote = async (text) => {
    if (!text.trim()) return;
    const created = await apiClient.post('/api/notes', { text: text.trim() });
    setNotes(prev => [created, ...prev]);
    embedAndIndex(created).catch(e => console.error('embed failed on add', e));
  };

  const editNote = async (id, newText) => {
    const trimmed = newText.trim();
    const updated = await apiClient.put(`/api/notes/${id}`, { text: trimmed });
    setNotes(prev => prev.map(n => n.id === id ? updated : n));
    embedAndIndex({ id, text: trimmed }).catch(e => console.error('embed failed on edit', e));
  };

  const deleteNote = async (id) => {
    await apiClient.delete(`/api/notes/${id}`);
    setNotes(prev => prev.filter(n => n.id !== id));
    deleteNoteVector(id).catch(e => console.error('delete vector failed', e));
  };

  return (
    <QuickNotesContext.Provider value={{ notes, addNote, editNote, deleteNote }}>
      {children}
    </QuickNotesContext.Provider>
  );
};

export const useQuickNotes = () => useContext(QuickNotesContext);
