import type { Random } from '../types/random';
import { toHashChunk } from './to-hash-chunk';

export const toHashChunks = (random: Random): string =>
  toHashChunk(random()) + toHashChunk(random());
