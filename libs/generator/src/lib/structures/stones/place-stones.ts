import type { Tile } from '@mander/model';
import type { createRandom } from '@mander/utils';
import { flow } from 'lodash-es';
import { clearLoneStones } from './internal/clear-lone-stones';
import { createStonePatches } from './internal/create-stone-patches';
import { findDeepDirt } from './internal/find-deep-dirt';
import { patchStoneTiles } from './internal/patch-stone-tiles';
import { pickDirtDepth } from './internal/pick-dirt-depth';
import { smoothStoneCells } from './internal/smooth-stone-cells';

export const placeStones = (
  tiles: Tile[][],
  random: ReturnType<typeof createRandom>,
) =>
  flow(
    pickDirtDepth,
    findDeepDirt,
    smoothStoneCells,
    clearLoneStones,
    createStonePatches,
    patchStoneTiles,
  )({ tiles, random });
