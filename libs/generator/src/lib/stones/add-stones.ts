import type { createRandom } from '@mander/engine';
import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { computeSmoothStoneCells } from './internal/compute-smooth-stone-cells';
import { computeStoneDeepDirtCells } from './internal/compute-stone-deep-dirt-cells';
import { createStonePatches } from './internal/create-stone-patches';
import { patchStoneTiles } from './internal/patch-stone-tiles';
import { removeLoneStones } from './internal/remove-lone-stones';
import { takeRandomStoneDirtDepth } from './internal/take-random-stone-dirt-depth';

export const addStones = (
  tiles: Tile[][],
  random: ReturnType<typeof createRandom>,
): Tile[][] =>
  flow(
    takeRandomStoneDirtDepth,
    computeStoneDeepDirtCells,
    computeSmoothStoneCells,
    removeLoneStones,
    createStonePatches,
    patchStoneTiles,
  )({ tiles, random });
