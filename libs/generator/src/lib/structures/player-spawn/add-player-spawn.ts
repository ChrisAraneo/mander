import { type Tile, TILE_SPAWN } from '@mander/model';
import { chain } from '@mander/utils';
import { flow, map, isEmpty } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { patchTiles } from '../patch-tiles';
import { sortColumnsByPriority } from './sort-columns-by-priority';
import { findValidSpawnRows } from './find-valid-spawn-rows';
import { createColumnNumbers } from './create-column-numbers';

const { nullish } = P;

export const addPlayerSpawn = (tiles: Tile[][]): Tile[][] =>
  chain(flow(createColumnNumbers, sortColumnsByPriority)(tiles))
    .map((column) => ({ column, rows: findValidSpawnRows(tiles, column) }))
    .find(({ rows }) => !isEmpty(rows))
    .thru((found) =>
      match(found)
        .with(nullish, () => [])
        .otherwise(({ column, rows }) =>
          map(rows, (row) => ({
            row,
            column,
            tile: TILE_SPAWN,
          })),
        ),
    )
    .thru((patches) => patchTiles(tiles, patches))
    .value();
