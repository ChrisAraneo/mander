import type { Rng } from '../../rng';
import type { Structure, StructureDifficulty } from '../types';
import { structurePool } from './structure-pool';

export function rollStructure(rng: Rng, difficulty: StructureDifficulty): Structure {
  return rng.pick(structurePool(difficulty));
}
