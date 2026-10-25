import type { Random } from '@mander/engine';
import type { Tile } from '@mander/model';
import type { Cell } from '../../../types/cell';

export interface SpikeCells {
  tiles: Tile[][];
  rate: number;
  cells: Cell[];
  random: Random;
}
