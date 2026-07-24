import { HARD_STRUCTURES, NORMAL_STRUCTURES } from '../library';
import type { Structure, StructureDifficulty } from '../types';

export const structurePool = (
  difficulty: StructureDifficulty,
): readonly Structure[] => {
  if (difficulty === 'HARD') return HARD_STRUCTURES;
  return NORMAL_STRUCTURES;
};
