import type { Random } from '../types/random';
import { toHashChunk } from './to-hash-chunk';

export const toHashChunks = (hash: Random): string =>
  toHashChunk(hash()) + toHashChunk(hash());
