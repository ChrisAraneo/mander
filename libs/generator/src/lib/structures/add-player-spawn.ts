import { isSolidTile, type Tile, TILE_AIR, TILE_SPAWN } from '@mander/model';
import {
  concat,
  every,
  filter,
  find,
  findIndex,
  forEach,
  map,
  range,
  size,
} from 'lodash-es';

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

const isFree = (tiles: Tile[][], column: number): boolean => {
  const surface = surfaceRow(tiles, column);

  return (
    surface >= SPAWN_HEIGHT &&
    every(stackRows(surface), (row) => tiles[row][column] === TILE_AIR)
  );
};

export const addPlayerSpawn = (tiles: Tile[][]): Tile[][] => {
  const marked = map(tiles, (row) => [...row]);
  const column = find(columnOrder(size(marked[0])), (candidate) =>
    isFree(marked, candidate),
  );

  if (column === undefined) return marked;

  forEach(stackRows(surfaceRow(marked, column)), (row) => {
    marked[row][column] = TILE_SPAWN;
  });

  return marked;
};
