import type { Tile } from '@mander/model';
import type { Cell } from '../../../types/cell';

export interface SpikeSlice {
  tiles: Tile[][];
  cells: Cell[];
}
