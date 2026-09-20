import { isSolidTile, type Tile } from '@mander/model';
import { chain } from '@mander/utils';
import { map, findIndex, range } from 'lodash-es';
import { match } from 'ts-pattern';
import { SPAWN_HEIGHT } from './consts';

export const findSurfaceRows = (tiles: Tile[][], column: number): number[] =>
  chain(findIndex(tiles, (row) => isSolidTile(row[column])))
    .thru((surface) =>
      match(surface)
        .when(
          (value) => value >= SPAWN_HEIGHT,
          (value) =>
            map(range(1, SPAWN_HEIGHT + 1), (offset) => value - offset),
        )
        .otherwise(() => []),
    )
    .value();
