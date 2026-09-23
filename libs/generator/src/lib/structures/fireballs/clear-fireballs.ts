import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { checkFireballsLit } from './internal/check-fireballs-lit';
import { createFireballPatches } from './internal/create-fireball-patches';
import { findFireballCells } from './internal/find-fireball-cells';
import { patchFireballTiles } from './internal/patch-fireball-tiles';

export const clearFireballs = (tiles: Tile[][], levelNumber: number) =>
  flow(
    checkFireballsLit,
    findFireballCells,
    createFireballPatches,
    patchFireballTiles,
  )({ tiles, levelNumber });
