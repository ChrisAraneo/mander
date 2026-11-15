import { pipe } from 'remeda';
import { createMulberry32 } from './internal/create-mulberry32';
import { createXmur3 } from './internal/create-xmur3';
import type { Random } from './types/random';

export const createRandom = (seed: string): Random =>
  pipe(seed, createXmur3, (hash) => hash(), createMulberry32);
