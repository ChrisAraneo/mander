import { isSolidTile, type Tile, TILE_AIR, TILE_SPAWN } from '@mander/model';
import { chain } from '@mander/utils';
import { concat, every, filter, findIndex, map, range, size } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { patchTiles, type TilePatch } from './patch-tiles';

const { nullish } = P;

const SPAWN_HEIGHT = 2;

const PREFERRED_COLUMNS = [1, 2, 3, 0];

const columnOrder = (width: number): number[] =>
  filter(
    concat(PREFERRED_COLUMNS, range(size(PREFERRED_COLUMNS), width)),
    (column) => column < width,
  );

const surfaceRow = (tiles: Tile[][], column: number): number =>
  findIndex(tiles, (row) => isSolidTile(row[column]));

const stackRows = (surface: number): number[] =>
  map(range(1, SPAWN_HEIGHT + 1), (offset) => surface - offset);

const isFree = (tiles: Tile[][], column: number): boolean =>
  chain(surfaceRow(tiles, column))
    .thru(
      (surface) =>
        surface >= SPAWN_HEIGHT &&
        every(stackRows(surface), (row) => tiles[row][column] === TILE_AIR),
    )
    .value();

export const addPlayerSpawn = (tiles: Tile[][]): Tile[][] =>
  chain(columnOrder(size(tiles[0])))
    .find((candidate) => isFree(tiles, candidate))
    .thru((column) =>
      match(column)
        .with(nullish, (): TilePatch[] => [])
        .otherwise((found): TilePatch[] =>
          map(stackRows(surfaceRow(tiles, found)), (row) => ({
            row,
            column: found,
            tile: TILE_SPAWN,
          })),
        ),
    )
    .thru((patches) => patchTiles(tiles, patches))
    .value();
