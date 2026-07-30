import type { Tile } from '@mander/engine';

export interface Platform {
  column: number;
  row: number;
  isOverHole: boolean;
  material: Tile;
}
