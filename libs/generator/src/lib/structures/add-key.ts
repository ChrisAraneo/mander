import { isSolidTile, type Tile, TILE_AIR, TILE_KEY } from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import { chain } from '@mander/utils';
import { findIndex, floor, range, size, sortBy } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { patchTiles, type TilePatch } from './patch-tiles';

const { nullish } = P;

const getMiddleSeam = (width: number): number =>
  floor(width / 2 / STRUCTURE_WIDTH) * STRUCTURE_WIDTH;

const getColumnOrder = (width: number, seam: number): number[] =>
  sortBy(range(0, width), (column) => Math.abs(column - seam));

const findSurfaceRow = (tiles: Tile[][], column: number): number =>
  findIndex(tiles, (row) => isSolidTile(row[column]));

const isFree = (tiles: Tile[][], column: number): boolean =>
  chain(findSurfaceRow(tiles, column))
    .thru((surface) => surface >= 1 && tiles[surface - 1][column] === TILE_AIR)
    .value();

export const addKey = (tiles: Tile[][]): Tile[][] =>
  chain(size(tiles[0]))
    .thru((width) => getColumnOrder(width, getMiddleSeam(width)))
    .find((candidate) => isFree(tiles, candidate))
    .thru((column) =>
      match(column)
        .with(nullish, (): TilePatch[] => [])
        .otherwise((found): TilePatch[] => [
          {
            row: findSurfaceRow(tiles, found) - 1,
            column: found,
            tile: TILE_KEY,
          },
        ]),
    )
    .thru((patches) => patchTiles(tiles, patches))
    .value();
