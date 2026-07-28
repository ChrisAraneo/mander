import type { Level } from '../world';

export const cellIndex = (tiles: Level, row: number, col: number): number =>
  row * tiles.width + col;
