import type { Random } from './types/random';

export const isRollUnder = (probability: number, random: Random): boolean =>
  random() < probability;
