import { reduce, size } from 'lodash-es';
import { pipe } from 'remeda';
import { hashChar } from './hash-char';
import { nextXmur3Hash } from './next-xmur3-hash';
import type { Xmur3Cell } from './types/xmur3-cell';

const SEED = 1_779_033_703;

export const createXmur3 = (input: string): (() => number) =>
  pipe(
    input,
    (text) => reduce(text, hashChar, SEED ^ size(text)),
    (hash): Xmur3Cell => ({ hash }),
    (cell) => (): number => nextXmur3Hash(cell),
  );
