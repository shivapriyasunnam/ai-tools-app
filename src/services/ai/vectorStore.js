import { OPSQLiteVectorStore } from '@react-native-rag/op-sqlite';
import { embed, initEmbedder } from './embeddings';

// Thin adapter so OPSQLiteVectorStore reuses our singleton embedder
// instead of loading a second copy of the model.
class EmbeddingsAdapter {
  async load() { await initEmbedder(); }
  async unload() {}
  async embed(text) { return embed(text); }
}

// Promise-based singleton: prevents concurrent inits and avoids caching a
// broken instance when load() throws (e.g. embedder races at startup).
let storePromise = null;

async function initVectorStore() {
  if (!storePromise) {
    storePromise = (async () => {
      const s = new OPSQLiteVectorStore({
        name: 'notes_vectors.db',
        embeddings: new EmbeddingsAdapter(),
      });
      await s.load();
      return s;
    })().catch(e => {
      storePromise = null; // reset so next call can retry
      throw e;
    });
  }
  return storePromise;
}

export async function upsertNoteVector(noteId, vector, text) {
  const s = await initVectorStore();
  const existing = (
    await s.db.execute('SELECT 1 FROM vectors WHERE id = ? LIMIT 1', [noteId])
  ).rows;
  if (existing.length > 0) {
    await s.update({ id: noteId, embedding: vector, document: text });
  } else {
    await s.add({ id: noteId, embedding: vector, document: text });
  }
}

export async function deleteNoteVector(noteId) {
  const s = await initVectorStore();
  await s.delete({ predicate: (r) => r.id === noteId });
}

export async function queryNotes(queryVector, k = 5) {
  const s = await initVectorStore();
  const results = await s.query({ queryEmbedding: queryVector, nResults: k });
  return results.map(r => ({ id: r.id, score: r.similarity, text: r.document }));
}

export async function listIndexedIds() {
  const s = await initVectorStore();
  const res = await s.db.execute('SELECT id FROM vectors');
  return res.rows.map(r => r.id);
}

export async function backfillNoteEmbeddings(allNotes) {
  const existingIds = await listIndexedIds();
  const missing = allNotes.filter(n => !existingIds.includes(n.id));
  for (const note of missing) {
    const vector = await embed(note.text);
    await upsertNoteVector(note.id, vector, note.text);
  }
}

export async function pruneOrphanedVectors(allNotes) {
  const noteIds = new Set(allNotes.map(n => n.id));
  const indexedIds = await listIndexedIds();
  const orphans = indexedIds.filter(id => !noteIds.has(id));
  if (orphans.length === 0) return;
  console.log(`[VectorStore] pruning ${orphans.length} orphaned vector(s):`, orphans);
  const s = await initVectorStore();
  for (const id of orphans) {
    await s.delete({ predicate: r => r.id === id });
  }
}
