import type { Tile } from '@mander/model';
import type { createRandom } from '@mander/utils';
import { flow } from 'lodash-es';
import { computeDeepDirtCells } from './internal/compute-deep-dirt-cells';
import { computeSmoothStoneCells } from './internal/compute-smooth-stone-cells';
import { createStonePatches } from './internal/create-stone-patches';
import { patchStoneTiles } from './internal/patch-stone-tiles';
import { removeLoneStones } from './internal/remove-lone-stones';
import { takeRandomDirtDepth } from './internal/take-random-dirt-depth';

export const addStones = (
  tiles: Tile[][],
  random: ReturnType<typeof createRandom>,
) =>
  flow(
    takeRandomDirtDepth,
    computeDeepDirtCells,
    computeSmoothStoneCells,
    removeLoneStones,
    createStonePatches,
    patchStoneTiles,
  )({ tiles, random });
