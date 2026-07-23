import { floor } from 'lodash-es';

import { mulberry32 } from './mulberry32';
import type { Rng } from './rng';
import { xmur3 } from './xmur3';

export const createRng = (seed: string): Rng => {
  const next = mulberry32(xmur3(seed)());
  return {
    next,
    int(min, max) {
      return min + floor(next() * (max - min + 1));
    },
    chance(probability) {
      return next() < probability;
    },
    pick(values) {
      return values[floor(next() * values.length)];
    },
  };
};
