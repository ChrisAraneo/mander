import { toLower } from 'lodash-es';
import type { LevelCategory } from '../types/level-category';

export const formatLevelCategorySeed = (
  seed: string,
  levelCategory: LevelCategory,
): string => `${seed}#${toLower(levelCategory)}`;
