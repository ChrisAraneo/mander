import type { Rng } from '../../rng';
import type { Structure, StructureDifficulty } from '../types';
import { structurePool } from './structure-pool';

export const rollStructure = (
  rng: Rng,
  difficulty: StructureDifficulty,
): Structure => rng.pick(structurePool(difficulty));
