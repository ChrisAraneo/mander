import { match } from 'ts-pattern';
import type { LevelVariant } from '../../types/level-variant';
import type { LevelCategory } from '../types/level-category';

export const toLevelCategory = (levelVariant: LevelVariant): LevelCategory =>
  match(levelVariant)
    .with('VERTICAL', (): LevelCategory => 'VERTICAL')
    .with('HARD', (): LevelCategory => 'HARD')
    .with('NORMAL', 'MIRRORED', (): LevelCategory => 'NORMAL')
    .exhaustive();
