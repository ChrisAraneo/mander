import type { Tile } from '@mander/model';
import { pipe } from 'remeda';
import { createCannonPatches } from './internal/create-cannon-patches';
import { filterCannonCells } from './internal/filter-cannon-cells';
import { getCannonRemovalRate } from './internal/get-cannon-removal-rate';
import { patchCannonTiles } from './internal/patch-cannon-tiles';
import { sliceCannonCells } from './internal/slice-cannon-cells';

export const removeCannons = (tiles: Tile[][], levelNumber: number): Tile[][] =>
  pipe(
    { tiles, levelNumber },
    getCannonRemovalRate,
    filterCannonCells,
    sliceCannonCells,
    createCannonPatches,
    patchCannonTiles,
  );
