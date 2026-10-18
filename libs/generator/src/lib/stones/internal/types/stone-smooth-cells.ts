import type { Tile } from '@mander/model';
import type { Field } from './field';

export interface StoneSmoothCells {
  tiles: Tile[][];
  cells: Field;
}
