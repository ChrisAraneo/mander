import {
  isSolidTile,
  type Tile,
  TILE_BRICK,
  TILE_FIREBALL,
} from '@mander/model';
import { find, map } from 'lodash-es';
import { match } from 'ts-pattern';

export const FIRST_FIREBALL_LEVEL = 4;

export const LAST_FIREBALL_LEVEL = 8;

const NEIGHBOURS: readonly number[][] = Object.freeze([
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
]);

const isBorrowable = (tile: Tile | undefined): boolean =>
  tile !== undefined && tile !== TILE_FIREBALL && isSolidTile(tile);

const borrowedFrom = (tiles: Tile[][], row: number, column: number): Tile =>
  find(
    map(NEIGHBOURS, ([stepX, stepY]) => tiles[row + stepY]?.[column + stepX]),
    isBorrowable,
  ) ?? TILE_BRICK;

const quenched = (tiles: Tile[][]): Tile[][] =>
  map(tiles, (cells, row) =>
    map(cells, (tile, column) =>
      match(tile === TILE_FIREBALL)
        .with(true, () => borrowedFrom(tiles, row, column))
        .otherwise(() => tile),
    ),
  );

export const clearFireballs = (
  tiles: Tile[][],
  levelNumber: number,
): Tile[][] =>
  match(
    levelNumber >= FIRST_FIREBALL_LEVEL && levelNumber <= LAST_FIREBALL_LEVEL,
  )
    .with(true, () => map(tiles, (row) => [...row]))
    .otherwise(() => quenched(tiles));
