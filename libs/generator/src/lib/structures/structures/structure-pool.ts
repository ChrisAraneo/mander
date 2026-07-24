import { match } from 'ts-pattern';

import { HARD_STRUCTURES, NORMAL_STRUCTURES } from '../library';
import type { Structure, StructureDifficulty } from '../types';

export const structurePool = (
  difficulty: StructureDifficulty,
): readonly Structure[] =>
  match(difficulty)
    .with('HARD', () => HARD_STRUCTURES)
    .with('NORMAL', () => NORMAL_STRUCTURES)
    .exhaustive();
