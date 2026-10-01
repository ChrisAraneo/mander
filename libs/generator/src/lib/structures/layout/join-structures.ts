import type { Sector } from '@mander/structures';
import { flow } from 'lodash-es';
import type { LevelType } from '../types/level-type';
import { createStructureGrid } from './internal/create-structure-grid';
import { createStructurePatches } from './internal/create-structure-patches';
import { findStructurePlacements } from './internal/find-structure-placements';
import { patchStructureTiles } from './internal/patch-structure-tiles';
import { splitStructureLayers } from './internal/split-structure-layers';

export const joinStructures = (structures: Sector[], levelType: LevelType) =>
  flow(
    findStructurePlacements,
    createStructureGrid,
    splitStructureLayers,
    createStructurePatches,
    patchStructureTiles,
  )({ structures, levelType });
