import { isSolidTile, PORTAL_HEIGHT, type Tile } from '@mander/model';
import { chain } from '@mander/utils';
import { findIndex, map, range } from 'lodash-es';
import { match } from 'ts-pattern';

export const findSurfaceRows = (tiles: Tile[][], column: number) =>
  chain(findIndex(tiles, (row) => isSolidTile(row[column])))
    .thru((surface) =>
      match(surface)
        .when(
          (value) => value >= PORTAL_HEIGHT,
          (value) =>
            map(range(1, PORTAL_HEIGHT + 1), (offset) => value - offset),
        )
        .otherwise(() => []),
    )
    .value();
