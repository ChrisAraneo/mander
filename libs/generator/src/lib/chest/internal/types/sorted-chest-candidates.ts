import type { Tile } from '@mander/model';
import type { Spot } from '../../../types/spot';

export interface SortedChestCandidates {
  tiles: Tile[][];
  candidates: Spot[];
}
