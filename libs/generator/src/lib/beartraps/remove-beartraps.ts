import type { Random } from '@mander/engine';
import type { Tile } from '@mander/model';
import { pipe } from 'remeda';
import { createBeartrapPatches } from './internal/create-beartrap-patches';
import { filterBeartrapCells } from './internal/filter-beartrap-cells';
import { getBeartrapRemovalRate } from './internal/get-beartrap-removal-rate';
import { patchBeartrapTiles } from './internal/patch-beartrap-tiles';
import { sliceBeartrapCells } from './internal/slice-beartrap-cells';
import { sortBeartrapCellsRandomly } from './internal/sort-beartrap-cells-randomly';

export const removeBeartraps = (
  tiles: Tile[][],
  levelNumber: number,
  random: Random,
): Tile[][] =>
  pipe(
    { tiles, levelNumber, random },
    getBeartrapRemovalRate,
    filterBeartrapCells,
    sortBeartrapCellsRandomly,
    sliceBeartrapCells,
    createBeartrapPatches,
    patchBeartrapTiles,
  );
