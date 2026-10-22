import type { Tile } from '@mander/model';
import type { Cell } from '../../../types/cell';

export interface CannonSlice {
  tiles: Tile[][];
  cells: Cell[];
}
