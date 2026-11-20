import type { Random } from '@mander/common';
import { drop, sortBy, take } from 'lodash-es';
import type { LevelVariant } from '../types/level-variant';
import { EARLY_LEVELS } from './consts';

const LEVEL_VARIANTS: readonly LevelVariant[] = Object.freeze([
  'VERTICAL',
  'VERTICAL',
  'MIRRORED',
  'MIRRORED',
  'NORMAL',
  'NORMAL',
  'HARD',
  'HARD',
]);

export const createLevelVariants = (random: Random): LevelVariant[] => [
  ...sortBy(take(LEVEL_VARIANTS, EARLY_LEVELS), () => random()),
  ...drop(LEVEL_VARIANTS, EARLY_LEVELS),
];
