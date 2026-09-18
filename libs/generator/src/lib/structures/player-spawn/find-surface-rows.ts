import { isSolidTile, type Tile } from '@mander/model';
import { chain } from '@mander/utils';
import { map, findIndex, range } from 'lodash-es';
import { SPAWN_HEIGHT } from './consts';

export const findSurfaceRows = (tiles: Tile[][], column: number): number[] =>
  chain(findIndex(tiles, (row) => isSolidTile(row[column])))
    .thru((surface) =>
      surface >= SPAWN_HEIGHT
        ? map(range(1, SPAWN_HEIGHT + 1), (offset) => surface - offset)
        : [],
    )
    .value();
