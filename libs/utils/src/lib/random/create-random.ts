import { floor } from 'lodash-es';

import { mulberry32 } from './mulberry32';
import { xmur3 } from './xmur3';

export const createRandom = (seed: string) => {
  const next = mulberry32(xmur3(seed)());

  return {
    next,
    int(min: number, max: number) {
      return min + floor(next() * (max - min + 1));
    },
    chance(probability: number) {
      return next() < probability;
    },
    pick<T>(values: T[]): T {
      return values[floor(next() * values.length)];
    },
  };
};
