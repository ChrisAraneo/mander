import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { createCannonPatches } from './internal/create-cannon-patches';
import { filterCannonCells } from './internal/filter-cannon-cells';
import { getCannonRemovalRate } from './internal/get-cannon-removal-rate';
import { patchCannonTiles } from './internal/patch-cannon-tiles';
import { sliceCannonCells } from './internal/slice-cannon-cells';

export const removeCannons = (tiles: Tile[][], levelNumber: number): Tile[][] =>
  flow(
    getCannonRemovalRate,
    filterCannonCells,
    sliceCannonCells,
    createCannonPatches,
    patchCannonTiles,
  )({ tiles, levelNumber });
