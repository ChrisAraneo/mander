import { map, range } from 'lodash-es';
import { toLevelCategory } from './internal/to-level-category';

export const createLevelCategories = (levelCount: number) =>
  map(range(1, levelCount + 1), toLevelCategory);
