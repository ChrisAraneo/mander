import type { Tile } from '@mander/engine';

/** A spike a structure carries in its own grid, waiting to be stamped. */
export interface Spike {
  column: number;
  row: number;
  tile: Tile;
}
