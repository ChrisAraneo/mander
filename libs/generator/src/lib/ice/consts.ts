import {
  type Tile,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';

export const FREEZABLE_TILES: readonly Tile[] = Object.freeze([
  TILE_BRICK,
  TILE_STONE,
  TILE_WOOD,
  TILE_CERAMIC,
]);
