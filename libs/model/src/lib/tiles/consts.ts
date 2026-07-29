import { TILE_BRICK } from './brick';
import { TILE_CERAMIC } from './ceramic';
import { TILE_SOLID } from './solid';
import { TILE_STONE } from './stone';
import type { Tile } from './tile';
import { TILE_WOOD } from './wood';

export const TILE_SIZE = 32;

export const SOLID_TILES: Tile[] = [
  TILE_SOLID,
  TILE_BRICK,
  TILE_STONE,
  TILE_WOOD,
  TILE_CERAMIC,
];
