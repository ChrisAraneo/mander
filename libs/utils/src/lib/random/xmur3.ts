import { reduce, size } from 'lodash-es';

import { chain } from '../functions/chain.ts';

const SEED = 1_779_033_703;

const mixChar = (hashState: number, character: string): number =>
  chain(Math.imul(hashState ^ character.charCodeAt(0), 3_432_918_353))
    .thru((mixed) => (mixed << 13) | (mixed >>> 19))
    .value();

/** Same deal as mulberry32 — one cell, and the rest stays a pipeline. */
export const xmur3 = (input: string): (() => number) =>
  chain({ hash: reduce(input, mixChar, SEED ^ size(input)) })
    .thru(
      (cell) => (): number =>
        chain(Math.imul(cell.hash ^ (cell.hash >>> 16), 2_246_822_507))
          .thru((hash) => Math.imul(hash ^ (hash >>> 13), 3_266_489_909))
          .thru((hash) => hash ^ (hash >>> 16))
          .thru((hash) => Object.assign(cell, { hash }).hash >>> 0)
          .value(),
    )
    .value();
