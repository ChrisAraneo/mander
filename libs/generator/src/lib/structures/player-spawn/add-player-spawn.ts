import { type Tile, TILE_SPAWN } from '@mander/model';
import { chain } from '@mander/utils';
import { flow, map, isEmpty } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { patchTiles } from '../patch-tiles';
import { sortColumnNumbersByPriority } from './sort-column-numbers-by-priority';
import { createColumnNumbers } from './create-column-numbers';
import { createPlayerSpawnCandidates } from './create-player-spawn-candidates';

const { nullish } = P;

export const addPlayerSpawn = (tiles: Tile[][]): Tile[][] =>
  chain(flow(createColumnNumbers, sortColumnNumbersByPriority)(tiles))
    .thru((columns) => createPlayerSpawnCandidates(tiles, columns))
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
