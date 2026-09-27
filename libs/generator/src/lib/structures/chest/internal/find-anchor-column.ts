import { type Tile, TILE_PORTAL } from '@mander/model';
import { chain } from '@mander/utils';
import { includes, indexOf, size } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { nullish } = P;

export const findAnchorColumn = (tiles: Tile[][]) =>
  chain(tiles)
    .find((cells) => includes(cells, TILE_PORTAL))
    .thru((carrying) =>
      match(carrying)
        .with(nullish, () => size(tiles[0]) - 1)
        .otherwise((cells) => indexOf(cells, TILE_PORTAL)),
    )
    .value();
