import type { createRandom } from '@mander/engine';
import type { Tile } from '@mander/model';
import type { BeartrapRemovalRate } from './types/beartrap-removal-rate';

const BEARTRAP_REMOVAL_RATES: readonly number[] = Object.freeze([
  1, 0.6, 0.4, 0.2, 0, 0, 0, 0,
]);

const NOTHING_REMOVED = 0;

export const getBeartrapRemovalRate = ({
  tiles,
  levelNumber,
  random,
}: {
  tiles: Tile[][];
  levelNumber: number;
  random: ReturnType<typeof createRandom>;
}): BeartrapRemovalRate => ({
  tiles,
  rate: BEARTRAP_REMOVAL_RATES[levelNumber - 1] ?? NOTHING_REMOVED,
  random,
});
