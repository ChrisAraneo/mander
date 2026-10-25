import { pipe } from 'remeda';
import { nextMulberry32State } from './next-mulberry32-state';
import type { Mulberry32Cell } from './types/mulberry32-cell';

const SCALE = 4_294_967_296;

export const nextMulberry32Float = (cell: Mulberry32Cell): number =>
  pipe(
    cell,
    nextMulberry32State,
    (state) => Math.imul(state ^ (state >>> 15), 1 | state),
    (mixed) => (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed,
    (mixed) => ((mixed ^ (mixed >>> 14)) >>> 0) / SCALE,
  );
