import { answerFromNotes } from './ragAnswer';

export const TOOLS = [
  {
    name: 'search_notes',
    description: "Search the user's personal notes to answer questions about things they wrote down.",
    args: { query: 'string — the user\'s question or search phrase' },
  },
];

export const DISPATCH = {
  search_notes: async ({ query }, onToken) => answerFromNotes(query, onToken),
};

// Keyword router — Phase 1 has one tool so this is enough.
// When more tools are added, swap for an embedding-based or LLM classifier.
const NOTES_INTENT =
  /\b(note|notes|wrote|written|jotted|remember|recall|what did i|did i write|what.*about|in my notes|my note)\b/i;

export function pickTool(query) {
  if (NOTES_INTENT.test(query)) return 'search_notes';
  return null;
}

export async function handleQuery(query, onToken = () => {}) {
  const toolName = pickTool(query);
  console.log(`[router] query="${query}" → tool=${toolName ?? 'none'}`);

  if (!toolName) {
    return {
      answer: "I can search your notes — try asking 'what did I note about...?' or 'what do my notes say about...?'",
      sources: [],
      tool: null,
    };
  }

  const result = await DISPATCH[toolName]({ query }, onToken);
  return { ...result, tool: toolName };
}
