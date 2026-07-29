import type { Level } from '@mander/model';

export const cellIndex = (tiles: Level, row: number, col: number): number =>
  row * tiles.width + col;
