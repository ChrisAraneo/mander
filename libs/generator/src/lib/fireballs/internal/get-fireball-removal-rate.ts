import type { Tile } from '@mander/model';
import type { FireballRemovalRate } from './types/fireball-removal-rate';

const FIREBALL_REMOVAL_RATES: readonly number[] = Object.freeze([
  1, 1, 1, 0, 0, 0, 0, 0,
]);

const NOTHING_REMOVED = 0;

export const getFireballRemovalRate = ({
  tiles,
  levelNumber,
}: {
  tiles: Tile[][];
  levelNumber: number;
}): FireballRemovalRate => ({
  tiles,
  rate: FIREBALL_REMOVAL_RATES[levelNumber - 1] ?? NOTHING_REMOVED,
});
