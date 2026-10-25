import { floor, size } from 'lodash-es';
import type { Random } from './types/random';

export const takeRandom = <T>(values: T[], random: Random): T =>
  values[floor(random() * size(values))];
