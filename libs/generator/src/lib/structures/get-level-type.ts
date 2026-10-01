import { match } from 'ts-pattern';
import { isVertical } from './is-vertical';
import type { LevelType } from './types/level-type';

export const getLevelType = (levelNumber: number): LevelType =>
  match(isVertical(levelNumber))
    .with(true, (): LevelType => 'VERTICAL')
    .otherwise((): LevelType => 'HORIZONTAL');
