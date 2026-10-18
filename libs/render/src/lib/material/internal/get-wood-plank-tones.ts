import { memoize } from 'lodash-es';
import { computeWoodPlankTones } from './compute-wood-plank-tones';

export const getWoodPlankTones: (base: string) => string[] = memoize(
  computeWoodPlankTones,
);
