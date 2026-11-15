import { pipe } from 'remeda';
import { patchXmur3Hash } from './patch-xmur3-hash';
import type { Xmur3Cell } from './types/xmur3-cell';

const FIRST_MULTIPLIER = 2_246_822_507;
const SECOND_MULTIPLIER = 3_266_489_909;

export const nextXmur3Hash = (cell: Xmur3Cell): number =>
  pipe(
    cell.hash,
    (hash) => Math.imul(hash ^ (hash >>> 16), FIRST_MULTIPLIER),
    (hash) => Math.imul(hash ^ (hash >>> 13), SECOND_MULTIPLIER),
    (hash) => hash ^ (hash >>> 16),
    (hash) => patchXmur3Hash(cell, hash) >>> 0,
  );
