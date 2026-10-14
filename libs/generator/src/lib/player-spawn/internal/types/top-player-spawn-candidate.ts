import type { Tile } from '@mander/model';
import type { Spot } from '../../../types/spot';

export interface TopPlayerSpawnCandidate {
  tiles: Tile[][];
  candidate: Spot | undefined;
}
