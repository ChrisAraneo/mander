import {
  isSolidTile,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_PORTAL,
} from '@mander/model';
import {
  find,
  findIndex,
  includes,
  indexOf,
  map,
  range,
  size,
} from 'lodash-es';

const PORTAL_GAP = 2;

const anchorColumn = (tiles: Tile[][]): number => {
  const carrying = find(tiles, (cells) => includes(cells, TILE_PORTAL));

  return carrying === undefined
    ? size(tiles[0]) - 1
    : indexOf(carrying, TILE_PORTAL);
};

const columnOrder = (anchor: number): number[] =>
  range(anchor - PORTAL_GAP, -1, -1);

const surfaceRow = (tiles: Tile[][], column: number): number =>
  findIndex(tiles, (row) => isSolidTile(row[column]));

const isFree = (tiles: Tile[][], column: number): boolean => {
  const surface = surfaceRow(tiles, column);

  return surface >= 1 && tiles[surface - 1][column] === TILE_AIR;
};

export const addChest = (tiles: Tile[][]): Tile[][] => {
  const marked = map(tiles, (row) => [...row]);
  const column = find(columnOrder(anchorColumn(marked)), (candidate) =>
    isFree(marked, candidate),
  );

  if (column === undefined) {
    return marked;
  }

  marked[surfaceRow(marked, column) - 1][column] = TILE_CHEST;

  return marked;
};
