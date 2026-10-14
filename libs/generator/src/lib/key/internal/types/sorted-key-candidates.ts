import type { Tile } from '@mander/model';
import type { Spot } from '../../../types/spot';

export interface SortedKeyCandidates {
  tiles: Tile[][];
  candidates: Spot[];
}
