import { match } from 'ts-pattern';
import type { LevelVariant } from '../types/level-variant';
import type { LevelType } from '../types/level-type';
import { isVertical } from './is-vertical';

export const toLevelType = (levelVariant: LevelVariant): LevelType =>
  match(isVertical(levelVariant))
    .with(true, (): LevelType => 'VERTICAL')
    .otherwise((): LevelType => 'HORIZONTAL');
