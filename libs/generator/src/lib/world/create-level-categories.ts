import { map } from 'lodash-es';
import type { LevelVariant } from '../types/level-variant';
import { toLevelCategory } from './internal/to-level-category';
import type { LevelCategory } from './types/level-category';

export const createLevelCategories = (
  levelVariants: LevelVariant[],
): LevelCategory[] => map(levelVariants, toLevelCategory);
