import { TILE_CANNON } from '../blocks/tile-cannon';
import { TILE_CANNON_TRIPLE } from '../blocks/tile-cannon-triple';
import type { Tile } from '../types/tile';

export const CANNON_TILES: readonly Tile[] = Object.freeze([
  TILE_CANNON,
  TILE_CANNON_TRIPLE,
]);
