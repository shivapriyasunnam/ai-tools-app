import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const CHUNK_SIZE = 1900;

// SecureStore has a 2048-byte limit per key. This adapter splits large values
// (like Supabase JWTs) into chunks to stay within that limit.
const ChunkedSecureStore = {
  async getItem(key) {
    const countStr = await SecureStore.getItemAsync(`${key}__count`);
    if (!countStr) return SecureStore.getItemAsync(key);
    const count = parseInt(countStr, 10);
    const chunks = await Promise.all(
      Array.from({ length: count }, (_, i) => SecureStore.getItemAsync(`${key}__${i}`))
    );
    return chunks.every(c => c !== null) ? chunks.join('') : null;
  },
  async setItem(key, value) {
    if (value.length <= CHUNK_SIZE) {
      await SecureStore.deleteItemAsync(`${key}__count`).catch(() => {});
      return SecureStore.setItemAsync(key, value);
    }
    const chunks = value.match(new RegExp(`.{1,${CHUNK_SIZE}}`, 'g')) ?? [];
    await SecureStore.setItemAsync(`${key}__count`, String(chunks.length));
    await Promise.all(chunks.map((chunk, i) => SecureStore.setItemAsync(`${key}__${i}`, chunk)));
  },
  async removeItem(key) {
    const countStr = await SecureStore.getItemAsync(`${key}__count`).catch(() => null);
    if (countStr) {
      const count = parseInt(countStr, 10);
      await Promise.all([
        SecureStore.deleteItemAsync(`${key}__count`),
        ...Array.from({ length: count }, (_, i) => SecureStore.deleteItemAsync(`${key}__${i}`)),
      ]).catch(() => {});
    }
    return SecureStore.deleteItemAsync(key).catch(() => {});
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ChunkedSecureStore,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});
