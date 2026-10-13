import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { computeFireballsLit } from './internal/compute-fireballs-lit';
import { createFireballPatches } from './internal/create-fireball-patches';
import { filterFireballCells } from './internal/filter-fireball-cells';
import { patchFireballTiles } from './internal/patch-fireball-tiles';

export const removeFireballs = (tiles: Tile[][], levelNumber: number) =>
  flow(
    computeFireballsLit,
    filterFireballCells,
    createFireballPatches,
    patchFireballTiles,
  )({ tiles, levelNumber });
