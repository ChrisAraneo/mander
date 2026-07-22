import { HARD_STRUCTURES, NORMAL_STRUCTURES } from '../library';
import type { Structure, StructureDifficulty } from '../types';

export function structurePool(
  difficulty: StructureDifficulty,
): readonly Structure[] {
  return difficulty === 'hard' ? HARD_STRUCTURES : NORMAL_STRUCTURES;
}
