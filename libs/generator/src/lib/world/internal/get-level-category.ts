import { match, P } from 'ts-pattern';
import { FIRST_HARD_LEVEL } from '../../consts';
import { isVertical } from '../../structures/is-vertical';
import type { LevelCategory } from '../types/level-category';

const { number } = P;

export const getLevelCategory = (levelNumber: number): LevelCategory =>
  match(levelNumber)
    .when(isVertical, (): LevelCategory => 'VERTICAL')
    .with(number.gte(FIRST_HARD_LEVEL), (): LevelCategory => 'HARD')
    .otherwise((): LevelCategory => 'NORMAL');
