import { take } from 'lodash-es';
import type { LevelCategory } from '../types/level-category';
import { countIn } from './count-in';

export const getRank = (
  levelCategories: LevelCategory[],
  index: number,
): number => countIn(take(levelCategories, index), levelCategories[index]);
