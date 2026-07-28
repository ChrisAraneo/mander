import type { Tile } from './tile';

export const TILE_SIZE = 32;

export const TILE_EMPTY: Tile = 0;
export const TILE_SOLID: Tile = 1;
export const TILE_CHEST: Tile = 4;
export const TILE_KEY: Tile = 5;
export const TILE_PORTAL: Tile = 6;
export const TILE_ENEMY: Tile = 7;
export const TILE_SPAWN: Tile = 8;
export const TILE_BRICK: Tile = 9;
export const TILE_STONE: Tile = 10;
export const TILE_WOOD: Tile = 11;
export const TILE_CERAMIC: Tile = 12;

export const SOLID_TILES: Tile[] = [
  TILE_SOLID,
  TILE_BRICK,
  TILE_STONE,
  TILE_WOOD,
  TILE_CERAMIC,
];
