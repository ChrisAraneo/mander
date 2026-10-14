import type { Tile } from '@mander/model';
import type { Spot } from '../../../types/spot';

export interface ApartGemCandidates {
  tiles: Tile[][];
  candidates: Spot[];
}
