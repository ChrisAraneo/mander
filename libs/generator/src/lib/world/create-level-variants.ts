import type { createRandom } from '@mander/engine';
import { drop, sortBy, take } from 'lodash-es';
import { FIRST_HARD_LEVEL } from '../consts';
import type { LevelVariant } from '../types/level-variant';

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

const EARLY_LEVELS = FIRST_HARD_LEVEL - 1;

export const createLevelVariants = (
  random: ReturnType<typeof createRandom>,
): LevelVariant[] => [
  ...sortBy(take(LEVEL_VARIANTS, EARLY_LEVELS), () => random.rollFloat()),
  ...drop(LEVEL_VARIANTS, EARLY_LEVELS),
];
