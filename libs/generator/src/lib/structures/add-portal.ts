import { isSolidTile, type Tile, TILE_AIR, TILE_PORTAL } from '@mander/model';
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

const isFree = (tiles: Tile[][], column: number): boolean => {
  const surface = surfaceRow(tiles, column);

  return (
    surface >= PORTAL_HEIGHT &&
    every(stackRows(surface), (row) => tiles[row][column] === TILE_AIR)
  );
};

export const addPortal = (tiles: Tile[][]): Tile[][] => {
  const marked = map(tiles, (row) => [...row]);
  const column = find(columnOrder(size(marked[0])), (candidate) =>
    isFree(marked, candidate),
  );

  if (column === undefined) {
    return marked;
  }

  forEach(stackRows(surfaceRow(marked, column)), (row) => {
    marked[row][column] = TILE_PORTAL;
  });

  return marked;
};
