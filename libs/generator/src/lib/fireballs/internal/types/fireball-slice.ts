import type { Tile } from '@mander/model';
import type { Cell } from '../../../types/cell';

export interface FireballSlice {
  tiles: Tile[][];
  cells: Cell[];
}
