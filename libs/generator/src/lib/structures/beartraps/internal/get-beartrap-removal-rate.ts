import type { Tile } from '@mander/model';
import { BEARTRAP_REMOVAL_RATES } from '../../../consts';

const NOTHING_REMOVED = 0;

export const getBeartrapRemovalRate = ({
  tiles,
  levelNumber,
}: {
  tiles: Tile[][];
  levelNumber: number;
}) => ({
  tiles,
  levelNumber,
  rate: BEARTRAP_REMOVAL_RATES[levelNumber - 1] ?? NOTHING_REMOVED,
});
