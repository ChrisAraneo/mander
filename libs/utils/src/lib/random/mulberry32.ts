import { chain } from '../functions/chain.ts';

const STEP = 0x6d_2b_79_f5;

const SCALE = 4_294_967_296;

export const mulberry32 = (seed: number): (() => number) =>
  chain({ state: Math.trunc(seed) })
    .thru(
      (cell) => (): number =>
        chain(Object.assign(cell, { state: (cell.state + STEP) | 0 }).state)
          .thru((state) => Math.imul(state ^ (state >>> 15), 1 | state))
          .thru(
            (mixed) =>
              (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed,
          )
          .thru((mixed) => ((mixed ^ (mixed >>> 14)) >>> 0) / SCALE)
          .value(),
    )
    .value();
