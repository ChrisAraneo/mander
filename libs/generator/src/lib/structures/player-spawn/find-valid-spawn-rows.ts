import { TILE_AIR, type Tile } from '@mander/model';
import { chain } from '@mander/utils';
import { every, size } from 'lodash-es';
import { SPAWN_HEIGHT } from './consts';
import { findSurfaceRows } from './find-surface-rows';

export const findValidSpawnRows = (tiles: Tile[][], column: number): number[] =>
  chain(findSurfaceRows(tiles, column))
    .thru((rows) =>
      size(rows) === SPAWN_HEIGHT &&
      every(rows, (row) => tiles[row][column] === TILE_AIR)
        ? rows
        : [],
    )
    .value();
