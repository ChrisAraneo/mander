import type { Random } from '@mander/engine';
import type { Tile } from '@mander/model';
import type { SpikeRemovalRate } from './types/spike-removal-rate';

const SPIKE_REMOVAL_RATES: readonly number[] = Object.freeze([
  1, 0.8, 0.65, 0.45, 0.2, 0, 0, 0,
]);

const NOTHING_REMOVED = 0;

export const getSpikeRemovalRate = ({
  tiles,
  levelNumber,
  random,
}: {
  tiles: Tile[][];
  levelNumber: number;
  random: Random;
}): SpikeRemovalRate => ({
  tiles,
  rate: SPIKE_REMOVAL_RATES[levelNumber - 1] ?? NOTHING_REMOVED,
  random,
});
