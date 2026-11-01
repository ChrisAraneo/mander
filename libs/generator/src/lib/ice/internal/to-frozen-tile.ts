import {
  type Tile,
  TILE_FIREBALL,
  TILE_ICE,
  TILE_ICEBALL,
} from '@mander/model';
import { includes } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { FREEZABLE_TILES } from '../consts';

const { when } = P;

export const toFrozenTile = (tile: Tile): Tile =>
  match(tile)
    .with(TILE_FIREBALL, () => TILE_ICEBALL)
    .with(
      when((candidate: Tile) => includes(FREEZABLE_TILES, candidate)),
      () => TILE_ICE,
    )
    .otherwise(() => tile);
