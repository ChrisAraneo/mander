import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { clearLoneStones } from './internal/clear-lone-stones';
import { createStonePatches } from './internal/create-stone-patches';
import { findDeepDirt } from './internal/find-deep-dirt';
import { patchStoneTiles } from './internal/patch-stone-tiles';
import { pickDirtDepth } from './internal/pick-dirt-depth';
import { smoothStoneCells } from './internal/smooth-stone-cells';

export const placeStones = (tiles: Tile[][]) =>
  flow(
    pickDirtDepth,
    findDeepDirt,
    smoothStoneCells,
    clearLoneStones,
    createStonePatches,
    patchStoneTiles,
  )({ tiles });
