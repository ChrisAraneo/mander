import type { Season } from '@mander/model';
import { FIRST_HARD_LEVEL } from '../consts';

export const SEASONS: readonly Season[] = Object.freeze([
  'SPRING',
  'SUMMER',
  'AUTUMN',
  'WINTER',
]);

export const EARLY_LEVELS = FIRST_HARD_LEVEL - 1;
