import { map, range } from 'lodash-es';
import type { LevelCategory } from './types/level-category';
import { getLevelCategory } from './internal/get-level-category';

export const getLevelCategories = (levels: number): LevelCategory[] =>
  map(range(1, levels + 1), getLevelCategory);
