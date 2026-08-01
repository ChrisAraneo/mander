import {
  type Structure,
  type StructureDifficulty,
  structurePool,
} from '@mander/structures';

import type { Rng } from '../rng';

/** The library is the structures lib's; drawing one from it is ours. */
export const rollStructure = (
  rng: Rng,
  difficulty: StructureDifficulty,
): Structure => rng.pick(structurePool(difficulty));
