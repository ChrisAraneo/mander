import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { createFireballPatches } from './internal/create-fireball-patches';
import { findFireballCells } from './internal/find-fireball-cells';
import { markFireballsLit } from './internal/mark-fireballs-lit';
import { patchFireballTiles } from './internal/patch-fireball-tiles';

export const clearFireballs = (tiles: Tile[][], levelNumber: number) =>
  flow(
    markFireballsLit,
    findFireballCells,
    createFireballPatches,
    patchFireballTiles,
  )({ tiles, levelNumber });
