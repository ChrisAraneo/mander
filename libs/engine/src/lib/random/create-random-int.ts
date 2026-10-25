import { floor } from 'lodash-es';
import type { Random } from './types/random';

export const createRandomInt = (
  min: number,
  max: number,
  random: Random,
): number => min + floor(random() * (max - min + 1));
