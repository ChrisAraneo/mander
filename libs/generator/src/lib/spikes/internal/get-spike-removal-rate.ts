import type { Tile } from '@mander/model';
import type { createRandom } from '@mander/utils';
import { SPIKE_REMOVAL_RATES } from '../../consts';

const NOTHING_REMOVED = 0;

export const getSpikeRemovalRate = ({
  tiles,
  levelNumber,
  random,
}: {
  tiles: Tile[][];
  levelNumber: number;
  random: ReturnType<typeof createRandom>;
}) => ({
  tiles,
  random,
  rate: SPIKE_REMOVAL_RATES[levelNumber - 1] ?? NOTHING_REMOVED,
});
