import type { Tile } from '@mander/model';
import type { Cell } from '../../../types/cell';

export interface SpikeShuffledCells {
  tiles: Tile[][];
  rate: number;
  cells: Cell[];
}
