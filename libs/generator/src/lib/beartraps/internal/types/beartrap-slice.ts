import type { Tile } from '@mander/model';
import type { Cell } from '../../../types/cell';

export interface BeartrapSlice {
  tiles: Tile[][];
  cells: Cell[];
}
