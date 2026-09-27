import { match } from 'ts-pattern';
import { isVertical } from './is-vertical';

export type LevelType = 'HORIZONTAL' | 'VERTICAL';

export const getLevelType = (levelNumber: number): LevelType =>
  match(isVertical(levelNumber))
    .with(true, (): LevelType => 'VERTICAL')
    .otherwise((): LevelType => 'HORIZONTAL');
