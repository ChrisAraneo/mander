import type { Tile } from '@mander/model';
import type { createRandom } from '@mander/utils';
import type { BeartrapRemovalRate } from './types/beartrap-removal-rate';

const BEARTRAP_REMOVAL_RATES: readonly number[] = Object.freeze([
  0.5, 0.35, 0.2,
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
