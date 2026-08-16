import { chain } from '../functions/chain.ts';

const STEP = 0x6d_2b_79_f5;

const SCALE = 4_294_967_296;

/**
 * A PRNG is a mutable cell by definition — the sequence *is* the state. The
 * cell is kept explicit and alone so the bodies around it stay expressions.
 *
 * Native `Object.assign` stays here rather than lodash `assign`: this runs per
 * random draw during world generation, and lodash's key-walk plus per-key
 * `hasOwnProperty`/`eq` guard is pure overhead for a single known field.
 */
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
