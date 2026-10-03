import type { Tile } from '@mander/model';

export interface TilePatch {
  row: number;
  column: number;
  tile: Tile;
}
