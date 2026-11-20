import { floor, size } from 'lodash-es';
import type { Random } from './types/random';

export const tryTakeRandom = <T>(values: readonly T[], random: Random): T =>
  values[floor(random() * size(values))];
