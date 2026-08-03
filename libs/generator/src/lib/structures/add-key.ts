import { isSolidTile, type Tile, TILE_AIR, TILE_KEY } from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import { find, findIndex, floor, map, range, size, sortBy } from 'lodash-es';

const middleSeam = (width: number): number =>
  floor(width / 2 / STRUCTURE_WIDTH) * STRUCTURE_WIDTH;

const columnOrder = (width: number, seam: number): number[] =>
  sortBy(range(0, width), (column) => Math.abs(column - seam));

const surfaceRow = (tiles: Tile[][], column: number): number =>
  findIndex(tiles, (row) => isSolidTile(row[column]));

const isFree = (tiles: Tile[][], column: number): boolean => {
  const surface = surfaceRow(tiles, column);

  return surface >= 1 && tiles[surface - 1][column] === TILE_AIR;
};

export const addKey = (tiles: Tile[][]): Tile[][] => {
  const marked = map(tiles, (row) => [...row]);
  const width = size(marked[0]);
  const column = find(columnOrder(width, middleSeam(width)), (candidate) =>
    isFree(marked, candidate),
  );

  if (column === undefined) {
    return marked;
  }

  marked[surfaceRow(marked, column) - 1][column] = TILE_KEY;

  return marked;
};
