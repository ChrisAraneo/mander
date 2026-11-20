import {
  type Tile,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_FIREBALL,
  TILE_ICE,
  TILE_ICEBALL,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';
import { includes } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { when } = P;

const FREEZABLE_TILES: readonly Tile[] = Object.freeze([
  TILE_BRICK,
  TILE_STONE,
  TILE_WOOD,
  TILE_CERAMIC,
]);

export const toFrozenTile = (tile: Tile): Tile =>
  match(tile)
    .with(TILE_FIREBALL, () => TILE_ICEBALL)
    .with(
      when((candidate: Tile) => includes(FREEZABLE_TILES, candidate)),
      () => TILE_ICE,
    )
    .otherwise(() => tile);
