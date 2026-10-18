import type { Tile } from '@mander/model';
import type { Spot } from '../../../types/spot';

export interface SortedPlayerSpawnCandidates {
  tiles: Tile[][];
  candidates: Spot[];
}
