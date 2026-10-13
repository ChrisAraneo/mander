import { match } from 'ts-pattern';
import type { LevelType } from '../types/level-type';
import { isVertical } from './is-vertical';

export const toLevelType = (levelNumber: number): LevelType =>
  match(isVertical(levelNumber))
    .with(true, (): LevelType => 'VERTICAL')
    .otherwise((): LevelType => 'HORIZONTAL');
