import type { Random } from '@mander/common';
import type { Tile } from '@mander/model';
import type { Cell } from '../../../types/cell';

export interface TripleCannonCells {
  tiles: Tile[][];
  random: Random;
  cells: Cell[];
}
