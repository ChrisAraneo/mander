import { filter, size } from 'lodash-es';
import type { LevelCategory } from '../types/level-category';

export const countIn = (
  levelCategories: LevelCategory[],
  levelCategory: LevelCategory,
): number => size(filter(levelCategories, (drawn) => drawn === levelCategory));
