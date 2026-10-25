import type { Layers } from '@mander/model';
import type { Sector } from '@mander/structures';
import { pipe } from 'remeda';
import type { LevelType } from '../types/level-type';
import { computeStructurePlacements } from './internal/compute-structure-placements';
import { createStructureGrid } from './internal/create-structure-grid';
import { createStructurePatches } from './internal/create-structure-patches';
import { patchStructureTiles } from './internal/patch-structure-tiles';
import { splitStructureLayers } from './internal/split-structure-layers';

export const createStructureLayers = (
  structures: Sector[],
  levelType: LevelType,
): Layers =>
  pipe(
    { structures, levelType },
    computeStructurePlacements,
    createStructureGrid,
    splitStructureLayers,
    createStructurePatches,
    patchStructureTiles,
  );
