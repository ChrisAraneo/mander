import type { Tile } from '@mander/model';
import type { Spot } from '../../../types/spot';

export interface GemApartCandidates {
  tiles: Tile[][];
  candidates: Spot[];
}
