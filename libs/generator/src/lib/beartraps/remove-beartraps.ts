import type { createRandom } from '@mander/engine';
import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { createBeartrapPatches } from './internal/create-beartrap-patches';
import { filterBeartrapCells } from './internal/filter-beartrap-cells';
import { getBeartrapRemovalRate } from './internal/get-beartrap-removal-rate';
import { patchBeartrapTiles } from './internal/patch-beartrap-tiles';
import { sliceBeartrapCells } from './internal/slice-beartrap-cells';
import { sortBeartrapCellsRandomly } from './internal/sort-beartrap-cells-randomly';

export const removeBeartraps = (
  tiles: Tile[][],
  levelNumber: number,
  random: ReturnType<typeof createRandom>,
): Tile[][] =>
  flow(
    getBeartrapRemovalRate,
    filterBeartrapCells,
    sortBeartrapCellsRandomly,
    sliceBeartrapCells,
    createBeartrapPatches,
    patchBeartrapTiles,
  )({ tiles, levelNumber, random });
