import { map, range } from 'lodash-es';
import { getLevelCategory } from './internal/get-level-category';
import type { LevelCategory } from './types/level-category';

export const getLevelCategories = (levelCount: number): LevelCategory[] =>
  map(range(1, levelCount + 1), getLevelCategory);
