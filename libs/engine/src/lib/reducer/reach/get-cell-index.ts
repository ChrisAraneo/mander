import type { Level } from '@mander/model';

export const getCellIndex = (tiles: Level, row: number, col: number): number =>
  row * tiles.width + col;
