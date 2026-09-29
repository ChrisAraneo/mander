import { match } from 'ts-pattern';
import { FIRST_HARD_LEVEL } from '../../../consts';
import { isVertical } from '../../is-vertical';
import type { LevelCategory } from '../types/level-category';

export const getLevelCategory = (levelNumber: number): LevelCategory =>
  match(levelNumber)
    .when(isVertical, (): LevelCategory => 'VERTICAL')
    .when(
      (number) => number >= FIRST_HARD_LEVEL,
      (): LevelCategory => 'HARD',
    )
    .otherwise((): LevelCategory => 'NORMAL');
