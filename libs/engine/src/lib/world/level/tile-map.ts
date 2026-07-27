import type { Tile } from './tile';

export interface TileMap {
  width: number;
  height: number;
  tiles: Tile[][];
}
