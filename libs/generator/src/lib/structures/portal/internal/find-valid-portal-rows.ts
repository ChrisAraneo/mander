import { type Tile, TILE_AIR } from '@mander/model';
import { chain } from '@mander/utils';
import { every, size } from 'lodash-es';
import { match } from 'ts-pattern';
import { PORTAL_HEIGHT } from './consts';
import { findSurfaceRows } from './find-surface-rows';

export const findValidPortalRows = (tiles: Tile[][], column: number) =>
  chain(findSurfaceRows(tiles, column))
    .thru((rows) =>
      match(rows)
        .when(
          (value) =>
            size(value) === PORTAL_HEIGHT &&
            every(value, (row) => tiles[row][column] === TILE_AIR),
          (value) => value,
        )
        .otherwise(() => []),
    )
    .value();
