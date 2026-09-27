import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { createCannonPatches } from './internal/create-cannon-patches';
import { findCannonCells } from './internal/find-cannon-cells';
import { markCannonsArmed } from './internal/mark-cannons-armed';
import { patchCannonTiles } from './internal/patch-cannon-tiles';

export const clearCannons = (tiles: Tile[][], levelNumber: number) =>
  flow(
    markCannonsArmed,
    findCannonCells,
    createCannonPatches,
    patchCannonTiles,
  )({ tiles, levelNumber });
