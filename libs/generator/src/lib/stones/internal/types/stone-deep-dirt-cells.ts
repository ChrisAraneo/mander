import type { Tile } from '@mander/model';
import type { Field } from './field';

export interface StoneDeepDirtCells {
  tiles: Tile[][];
  cells: Field;
}
