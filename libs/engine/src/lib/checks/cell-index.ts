import type { TileMap } from '../world';

export const cellIndex = (tiles: TileMap, row: number, col: number): number =>
  row * tiles.width + col;
