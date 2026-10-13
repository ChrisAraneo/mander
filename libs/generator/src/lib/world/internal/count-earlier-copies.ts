import { take } from 'lodash-es';
import type { LevelCategory } from '../types/level-category';
import { countOccurrences } from './count-occurrences';

export const countEarlierCopies = (
  levelCategories: LevelCategory[],
  index: number,
): number =>
  countOccurrences(take(levelCategories, index), levelCategories[index]);
