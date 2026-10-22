import type { Tile } from '@mander/model';
import type { Cell } from '../../../types/cell';

export interface FireballCells {
  tiles: Tile[][];
  rate: number;
  cells: Cell[];
}
