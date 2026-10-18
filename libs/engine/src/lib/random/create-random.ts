import { floor } from 'lodash-es';
import { createMulberry32 } from './internal/create-mulberry32';
import { createXmur3 } from './internal/create-xmur3';

export const createRandom = (seed: string) => {
  const rollFloat = createMulberry32(createXmur3(seed)());

  return {
    rollFloat,
    rollInt(min: number, max: number) {
      return min + floor(rollFloat() * (max - min + 1));
    },
    isRollUnder(probability: number) {
      return rollFloat() < probability;
    },
    pick<T>(values: T[]): T {
      return values[floor(rollFloat() * values.length)];
    },
  };
};
