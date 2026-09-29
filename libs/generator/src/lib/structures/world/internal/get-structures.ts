import {
  HARD_STRUCTURES,
  NORMAL_STRUCTURES,
  type Sector,
  VERTICAL_STRUCTURES,
} from '@mander/structures';
import { match } from 'ts-pattern';
import type { LevelCategory } from '../types/level-category';

export const getStructures = (
  levelCategory: LevelCategory,
): readonly Sector[] =>
  match(levelCategory)
    .with('HARD', () => HARD_STRUCTURES)
    .with('VERTICAL', () => VERTICAL_STRUCTURES)
    .otherwise(() => NORMAL_STRUCTURES);
