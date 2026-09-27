import type { Tile } from '@mander/model';
import { SPIKE_REMOVAL_RATES } from '../../../consts';

const NOTHING_REMOVED = 0;

export const getSpikeRemovalRate = ({
  tiles,
  levelNumber,
}: {
  tiles: Tile[][];
  levelNumber: number;
}) => ({
  tiles,
  levelNumber,
  rate: SPIKE_REMOVAL_RATES[levelNumber - 1] ?? NOTHING_REMOVED,
});
