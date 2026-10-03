import type { Tile } from '@mander/model';
import type { createRandom } from '@mander/utils';
import { flow } from 'lodash-es';
import { createBeartrapPatches } from './internal/create-beartrap-patches';
import { findBeartrapCells } from './internal/find-beartrap-cells';
import { getBeartrapRemovalRate } from './internal/get-beartrap-removal-rate';
import { patchBeartrapTiles } from './internal/patch-beartrap-tiles';
import { pickBeartrapCells } from './internal/pick-beartrap-cells';
import { shuffleBeartrapCells } from './internal/shuffle-beartrap-cells';

export const clearBeartraps = (
  tiles: Tile[][],
  levelNumber: number,
  random: ReturnType<typeof createRandom>,
) =>
  flow(
    getBeartrapRemovalRate,
    findBeartrapCells,
    shuffleBeartrapCells,
    pickBeartrapCells,
    createBeartrapPatches,
    patchBeartrapTiles,
  )({ tiles, levelNumber, random });
