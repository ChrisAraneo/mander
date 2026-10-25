import type { Random } from '@mander/engine';
import type { Tile } from '@mander/model';
import { pipe } from 'remeda';
import { computeSmoothStoneCells } from './internal/compute-smooth-stone-cells';
import { computeStoneDeepDirtCells } from './internal/compute-stone-deep-dirt-cells';
import { createStonePatches } from './internal/create-stone-patches';
import { patchStoneTiles } from './internal/patch-stone-tiles';
import { removeLoneStones } from './internal/remove-lone-stones';
import { takeRandomStoneDirtDepth } from './internal/take-random-stone-dirt-depth';

export const addStones = (tiles: Tile[][], random: Random): Tile[][] =>
  pipe(
    { tiles, random },
    takeRandomStoneDirtDepth,
    computeStoneDeepDirtCells,
    computeSmoothStoneCells,
    removeLoneStones,
    createStonePatches,
    patchStoneTiles,
  );
