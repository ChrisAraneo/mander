import {
  isSolidTile,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_PORTAL,
} from '@mander/model';
import { chain } from '@mander/utils';
import { findIndex, includes, indexOf, range, size } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { patchTiles, type TilePatch } from './patch-tiles';

const { nullish } = P;

const PORTAL_GAP = 2;

const anchorColumn = (tiles: Tile[][]): number =>
  chain(tiles)
    .find((cells) => includes(cells, TILE_PORTAL))
    .thru((carrying) =>
      match(carrying)
        .with(nullish, () => size(tiles[0]) - 1)
        .otherwise((cells) => indexOf(cells, TILE_PORTAL)),
    )
    .value();

const columnOrder = (anchor: number): number[] =>
  range(anchor - PORTAL_GAP, -1, -1);

const surfaceRow = (tiles: Tile[][], column: number): number =>
  findIndex(tiles, (row) => isSolidTile(row[column]));

const isFree = (tiles: Tile[][], column: number): boolean =>
  chain(surfaceRow(tiles, column))
    .thru((surface) => surface >= 1 && tiles[surface - 1][column] === TILE_AIR)
    .value();

export const addChest = (tiles: Tile[][]): Tile[][] =>
  chain(columnOrder(anchorColumn(tiles)))
    .find((candidate) => isFree(tiles, candidate))
    .thru((column) =>
      match(column)
        .with(nullish, (): TilePatch[] => [])
        .otherwise((found): TilePatch[] => [
          {
            row: surfaceRow(tiles, found) - 1,
            column: found,
            tile: TILE_CHEST,
          },
        ]),
    )
    .thru((patches) => patchTiles(tiles, patches))
    .value();
