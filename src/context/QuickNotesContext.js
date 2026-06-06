import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { embed } from '../services/ai/embeddings';
import { backfillNoteEmbeddings, deleteNoteVector, pruneOrphanedVectors, upsertNoteVector } from '../services/ai/vectorStore';

const NOTES_KEY = 'quick_notes_data';

async function embedAndIndex(note) {
  const vector = await embed(note.text);
  await upsertNoteVector(note.id, vector, note.text);
}

export const QuickNotesContext = createContext();

export const QuickNotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    saveNotes();
  }, [notes]);

  const loadNotes = async () => {
    try {
      const data = await AsyncStorage.getItem(NOTES_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        setNotes(parsed);
        backfillNoteEmbeddings(parsed).catch(e => console.error('backfill failed', e));
        pruneOrphanedVectors(parsed).catch(e => console.error('prune failed', e));
      }
    } catch (e) {
      console.error('Failed to load notes', e);
    }
  };

  const saveNotes = async () => {
    try {
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes', e);
    }
  };

  const addNote = (text) => {
    if (!text.trim()) return;
    const note = { id: Date.now().toString(), text: text.trim() };
    setNotes(prev => [note, ...prev]);
    embedAndIndex(note).catch(e => console.error('embed failed on add', e));
  };

  const editNote = (id, newText) => {
    const trimmed = newText.trim();
    setNotes(prev => prev.map(note => note.id === id ? { ...note, text: trimmed } : note));
    embedAndIndex({ id, text: trimmed }).catch(e => console.error('embed failed on edit', e));
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    deleteNoteVector(id).catch(e => console.error('delete vector failed', e));
  };

  return (
    <QuickNotesContext.Provider value={{ notes, addNote, editNote, deleteNote }}>
      {children}
    </QuickNotesContext.Provider>
  );
};

export const useQuickNotes = () => useContext(QuickNotesContext);
