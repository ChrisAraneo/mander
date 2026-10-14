import type { Tile } from '@mander/model';
import type { createRandom } from '@mander/utils';
import { flow } from 'lodash-es';
import { createSpikePatches } from './internal/create-spike-patches';
import { filterSpikeCells } from './internal/filter-spike-cells';
import { getSpikeRemovalRate } from './internal/get-spike-removal-rate';
import { patchSpikeTiles } from './internal/patch-spike-tiles';
import { sliceSpikeCells } from './internal/slice-spike-cells';
import { sortSpikeCellsRandomly } from './internal/sort-spike-cells-randomly';

export const removeSpikes = (
  tiles: Tile[][],
  levelNumber: number,
  random: ReturnType<typeof createRandom>,
): Tile[][] =>
  flow(
    getSpikeRemovalRate,
    filterSpikeCells,
    sortSpikeCellsRandomly,
    sliceSpikeCells,
    createSpikePatches,
    patchSpikeTiles,
  )({ tiles, levelNumber, random });
