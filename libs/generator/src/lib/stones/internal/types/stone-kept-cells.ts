import type { Tile } from '@mander/model';
import type { Field } from './field';

export interface StoneKeptCells {
  tiles: Tile[][];
  cells: Field;
}
