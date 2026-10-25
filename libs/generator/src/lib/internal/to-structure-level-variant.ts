import { match } from 'ts-pattern';
import type { LevelVariant } from '../types/level-variant';
import type { LevelCategory } from '../world/types/level-category';

export const toStructureLevelVariant = (
  category: LevelCategory,
): LevelVariant =>
  match(category)
    .with('NORMAL', (): LevelVariant => 'NORMAL')
    .with('HARD', (): LevelVariant => 'HARD')
    .with('VERTICAL', (): LevelVariant => 'VERTICAL')
    .exhaustive();
