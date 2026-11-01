import { type Tile, TILE_ICE } from '@mander/model';
import { includes } from 'lodash-es';
import { match } from 'ts-pattern';
import { FREEZABLE_TILES } from '../consts';

export const toFrozenTile = (tile: Tile): Tile =>
  match(includes(FREEZABLE_TILES, tile))
    .with(true, () => TILE_ICE)
    .otherwise(() => tile);
