import type { Tile } from '@mander/model';
import type { Spot } from '../../../types/spot';

export interface SortedPortalCandidates {
  tiles: Tile[][];
  candidates: Spot[];
}
