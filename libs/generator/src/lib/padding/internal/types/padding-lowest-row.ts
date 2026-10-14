import type { Tile } from '@mander/model';

export interface PaddingLowestRow {
  tiles: Tile[][];
  front: Tile[][];
  lowest: number;
}
