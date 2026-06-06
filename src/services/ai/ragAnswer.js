import { models } from 'react-native-executorch';
import { ExecuTorchLLM } from '@react-native-rag/executorch';
import { embed } from './embeddings';
import { queryNotes } from './vectorStore';

const MIN_SCORE = 0.13; // minimum similarity score to consider a note relevant

let llm = null;

export async function initLLM(onProgress = () => {}) {
  if (llm) return llm;
  console.log('[RAG] Loading LLM (smollm2-135m-quantized)...');
  llm = new ExecuTorchLLM({
    ...models.llm.smollm2_1_135m(),
    onDownloadProgress: onProgress,
  });
  await llm.load();
  console.log('[RAG] LLM ready.');
  return llm;
}

// Matches prompt-echo and off-topic markers at the start OR mid-answer
const HALLUCINATION_MARKERS = /(^|\n)(Note:\s*to answer|Note:\s*I |The notes?[ ,]|The questions are|Questions?:|Follow-up|Summary:|In conclusion)/i;

function trimHallucination(text) {
  // Cut at known off-topic / prompt-echo markers
  const markerMatch = HALLUCINATION_MARKERS.exec(text);
  const clipped = markerMatch ? text.slice(0, markerMatch.index) : text;

  // Cut at first repeated sentence — catches small-model repetition loops
  const seen = new Set();
  const sentenceRe = /[^.!?\n]+[.!?\n]*/g;
  let m;
  let cutAt = clipped.length;
  while ((m = sentenceRe.exec(clipped)) !== null) {
    const key = m[0].trim().toLowerCase();
    if (key.length > 8) {
      if (seen.has(key)) { cutAt = m.index; break; }
      seen.add(key);
    }
  }

  return clipped.slice(0, cutAt).trim();
}

export async function answerFromNotes(question, onToken = () => {}) {
  console.log('\n━━━ RAG pipeline ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`[RAG] Question: "${question}"`);

  // ── 1. RETRIEVAL ──────────────────────────────────────────────────────────
  console.log('[RAG] [1/3] Retrieval — embedding question...');
  const t0 = Date.now();
  const qVector = await embed(question);
  console.log(`[RAG]   query vector: dim=${qVector.length}  first3=[${qVector.slice(0,3).map(v=>v.toFixed(4)).join(', ')}]`);

  const hits = await queryNotes(qVector, 5);
  console.log(`[RAG]   top-5 hits from vector store (${Date.now() - t0}ms):`);
  hits.forEach((h, i) =>
    console.log(`[RAG]   ${i + 1}. score=${h.score.toFixed(3)}  "${h.text}"`)
  );

  const relevantHits = hits.filter(h => h.score >= MIN_SCORE);
  console.log(`[RAG]   MIN_SCORE=${MIN_SCORE} → ${relevantHits.length}/${hits.length} notes pass gate`);

  if (relevantHits.length === 0) {
    console.log('[RAG]   No relevant notes — skipping LLM. Returning fallback.');
    console.log('━━━ end ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return {
      answer: "I couldn't find anything in your notes about that.",
      sources: [],
    };
  }

  // ── 2. AUGMENTATION ───────────────────────────────────────────────────────
  console.log('[RAG] [2/3] Augmentation — building prompt...');
  const topHits = relevantHits.slice(0, 3);
  const noteList = topHits.map(h => `- ${h.text}`).join('\n');
  const userMessage = `Notes:\n${noteList}\n\nIn one sentence, what do these notes say about "${question}"?`;

  console.log('[RAG]   user message:', userMessage);

  // ── 3. GENERATION ─────────────────────────────────────────────────────────
  console.log('[RAG] [3/3] Generation — calling LLM...');
  const t1 = Date.now();
  let tokenCount = 0;
  let streamBuf = '';
  let streamHalted = false;

  const model = await initLLM();
  const rawAnswer = await model.generate(
    [
      {
        role: 'system',
        content: 'Answer in one sentence using only the notes provided. Do not add information that is not in the notes.',
      },
      { role: 'user', content: userMessage },
    ],
    token => {
      tokenCount++;
      if (streamHalted) return;
      streamBuf += token;
      // Halt after first complete sentence
      if (/[.!?](\s|$)/.test(streamBuf)) {
        streamHalted = true;
        onToken(token);
        return;
      }
      const cleaned = trimHallucination(streamBuf);
      if (cleaned.length < streamBuf.trimEnd().length) {
        streamHalted = true;
        return;
      }
      onToken(token);
    },
    { maxNewTokens: 60 }
  );

  const trimmed = trimHallucination(rawAnswer).replace(/\s+/g, ' ').trim();
  const answer = trimmed.length > 15 ? trimmed : topHits.map(h => h.text).join('. ');

  console.log(`[RAG]   generated ${tokenCount} tokens in ${Date.now() - t1}ms`);
  console.log(`[RAG]   answer: "${answer}"`);
  console.log(`[RAG]   sources: ${relevantHits.map(h => `"${h.text}"`).join(', ')}`);
  console.log('━━━ end ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  return {
    answer,
    sources: relevantHits.map(h => ({ id: h.id, text: h.text })),
  };
}
