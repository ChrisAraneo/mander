import { isSolidTile, type Tile, TILE_AIR, TILE_PORTAL } from '@mander/model';
import { chain } from '@mander/utils';
import { concat, every, filter, findIndex, map, range, size } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { patchTiles, type TilePatch } from './patch-tiles';

const { nullish } = P;

const PORTAL_HEIGHT = 2;

const PREFERRED_OFFSETS = [1, 2, 3, 0];

const columnOrder = (width: number): number[] =>
  filter(
    map(
      concat(PREFERRED_OFFSETS, range(size(PREFERRED_OFFSETS), width)),
      (offset) => width - 1 - offset,
    ),
    (column) => column >= 0,
  );

const surfaceRow = (tiles: Tile[][], column: number): number =>
  findIndex(tiles, (row) => isSolidTile(row[column]));

const stackRows = (surface: number): number[] =>
  map(range(1, PORTAL_HEIGHT + 1), (offset) => surface - offset);

const isFree = (tiles: Tile[][], column: number): boolean =>
  chain(surfaceRow(tiles, column))
    .thru(
      (surface) =>
        surface >= PORTAL_HEIGHT &&
        every(stackRows(surface), (row) => tiles[row][column] === TILE_AIR),
    )
    .value();

export const addPortal = (tiles: Tile[][]): Tile[][] =>
  chain(columnOrder(size(tiles[0])))
    .find((candidate) => isFree(tiles, candidate))
    .thru((column) =>
      match(column)
        .with(nullish, (): TilePatch[] => [])
        .otherwise((found): TilePatch[] =>
          map(stackRows(surfaceRow(tiles, found)), (row) => ({
            row,
            column: found,
            tile: TILE_PORTAL,
          })),
        ),
    )
    .thru((patches) => patchTiles(tiles, patches))
    .value();
