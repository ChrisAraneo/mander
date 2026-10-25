import type { Tile } from '../types/tile';
import { TILE_BRICK } from './tile-brick';
import { TILE_CANNON } from './tile-cannon';
import { TILE_CERAMIC } from './tile-ceramic';
import { TILE_DIRT } from './tile-dirt';
import { TILE_FIREBALL } from './tile-fireball';
import { TILE_STONE } from './tile-stone';
import { TILE_WOOD } from './tile-wood';

export const SOLID_TILES: readonly Tile[] = Object.freeze([
  TILE_DIRT,
  TILE_BRICK,
  TILE_STONE,
  TILE_WOOD,
  TILE_CERAMIC,
  TILE_CANNON,
  TILE_FIREBALL,
]);
