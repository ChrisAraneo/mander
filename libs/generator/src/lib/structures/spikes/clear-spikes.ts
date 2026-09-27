import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { createSpikePatches } from './internal/create-spike-patches';
import { findSpikeCells } from './internal/find-spike-cells';
import { getSpikeRemovalRate } from './internal/get-spike-removal-rate';
import { patchSpikeTiles } from './internal/patch-spike-tiles';
import { pickSpikeCells } from './internal/pick-spike-cells';
import { shuffleSpikeCells } from './internal/shuffle-spike-cells';

export const clearSpikes = (tiles: Tile[][], levelNumber: number) =>
  flow(
    getSpikeRemovalRate,
    findSpikeCells,
    shuffleSpikeCells,
    pickSpikeCells,
    createSpikePatches,
    patchSpikeTiles,
  )({ tiles, levelNumber });
