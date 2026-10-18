import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { computeCannonsArmed } from './internal/compute-cannons-armed';
import { createCannonPatches } from './internal/create-cannon-patches';
import { filterCannonCells } from './internal/filter-cannon-cells';
import { patchCannonTiles } from './internal/patch-cannon-tiles';

export const removeCannons = (tiles: Tile[][], levelNumber: number): Tile[][] =>
  flow(
    computeCannonsArmed,
    filterCannonCells,
    createCannonPatches,
    patchCannonTiles,
  )({ tiles, levelNumber });
