import { pipe } from 'remeda';
import { nextMulberry32State } from './next-mulberry32-state';
import type { Mulberry32Cell } from './types/mulberry32-cell';

const SCALE = 4_294_967_296;

const MIX_MASK = 61;

const ODD_MASK = 1;

const STATE_SHIFT = 15;

const FIRST_MIX_SHIFT = 7;

const SECOND_MIX_SHIFT = 14;

export const nextMulberry32Float = (cell: Mulberry32Cell): number =>
  pipe(
    cell,
    nextMulberry32State,
    (state) => Math.imul(state ^ (state >>> STATE_SHIFT), ODD_MASK | state),
    (mixed) =>
      (mixed +
        Math.imul(mixed ^ (mixed >>> FIRST_MIX_SHIFT), MIX_MASK | mixed)) ^
      mixed,
    (mixed) => ((mixed ^ (mixed >>> SECOND_MIX_SHIFT)) >>> 0) / SCALE,
  );
