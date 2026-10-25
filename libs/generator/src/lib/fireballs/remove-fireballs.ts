import type { Tile } from '@mander/model';
import { pipe } from 'remeda';
import { createFireballPatches } from './internal/create-fireball-patches';
import { filterFireballCells } from './internal/filter-fireball-cells';
import { getFireballRemovalRate } from './internal/get-fireball-removal-rate';
import { patchFireballTiles } from './internal/patch-fireball-tiles';
import { sliceFireballCells } from './internal/slice-fireball-cells';

export const removeFireballs = (
  tiles: Tile[][],
  levelNumber: number,
): Tile[][] =>
  pipe(
    { tiles, levelNumber },
    getFireballRemovalRate,
    filterFireballCells,
    sliceFireballCells,
    createFireballPatches,
    patchFireballTiles,
  );
