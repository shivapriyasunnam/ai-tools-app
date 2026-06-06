import { models } from 'react-native-executorch';
import { ExecuTorchEmbeddings } from '@react-native-rag/executorch';

// Promise singleton: concurrent callers all await the same load,
// and a failed load resets so the next call can retry.
let embedderPromise = null;

export async function initEmbedder(onProgress = () => {}) {
  if (!embedderPromise) {
    embedderPromise = (async () => {
      const e = new ExecuTorchEmbeddings({
        ...models.text_embedding.all_minilm_l6_v2(),
        onDownloadProgress: onProgress,
      });
      await e.load();
      return e;
    })().catch(err => {
      embedderPromise = null;
      throw err;
    });
  }
  return embedderPromise;
}

export async function embed(text) {
  const model = await initEmbedder();
  return model.embed(text); // returns number[] length 384
}
