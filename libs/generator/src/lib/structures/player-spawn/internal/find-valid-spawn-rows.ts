import { SPAWN_HEIGHT, TILE_AIR, type Tile } from '@mander/model';
import { chain } from '@mander/utils';
import { every, size } from 'lodash-es';
import { match } from 'ts-pattern';
import { findSurfaceRows } from './find-surface-rows';

export const findValidSpawnRows = (tiles: Tile[][], column: number) =>
  chain(findSurfaceRows(tiles, column))
    .thru((rows) =>
      match(rows)
        .when(
          (value) =>
            size(value) === SPAWN_HEIGHT &&
            every(value, (row) => tiles[row][column] === TILE_AIR),
          (value) => value,
        )
        .otherwise(() => []),
    )
    .value();
