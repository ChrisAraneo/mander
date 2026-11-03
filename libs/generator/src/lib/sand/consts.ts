import {
  type Tile,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_DIRT,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';

export const SANDABLE_TILES: readonly Tile[] = Object.freeze([
  TILE_DIRT,
  TILE_BRICK,
  TILE_STONE,
  TILE_WOOD,
  TILE_CERAMIC,
]);
