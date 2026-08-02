import { TILE_BRICK } from './brick';
import { TILE_CERAMIC } from './ceramic';
import { TILE_DIRT } from './dirt';
import { TILE_STONE } from './stone';
import type { Tile } from '../tile/tile';
import { TILE_WOOD } from './wood';

export const SOLID_TILES: readonly Tile[] = Object.freeze([
  TILE_DIRT,
  TILE_BRICK,
  TILE_STONE,
  TILE_WOOD,
  TILE_CERAMIC,
]);
