import type { Tile } from '@mander/model';
import type { CannonRemovalRate } from './types/cannon-removal-rate';

const CANNON_REMOVAL_RATES: readonly number[] = Object.freeze([
  1, 1, 1, 1, 0.5, 0.2, 0, 0,
]);

const NOTHING_REMOVED = 0;

export const getCannonRemovalRate = ({
  tiles,
  levelNumber,
}: {
  tiles: Tile[][];
  levelNumber: number;
}): CannonRemovalRate => ({
  tiles,
  rate: CANNON_REMOVAL_RATES[levelNumber - 1] ?? NOTHING_REMOVED,
});
