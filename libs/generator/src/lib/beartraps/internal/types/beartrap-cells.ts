import type { createRandom } from '@mander/engine';
import type { Tile } from '@mander/model';
import type { Cell } from '../../../types/cell';

export interface BeartrapCells {
  tiles: Tile[][];
  rate: number;
  cells: Cell[];
  random: ReturnType<typeof createRandom>;
}
