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
  sortBy,
} from 'lodash-es';

/**
 * The column the way out stands in. A level with no portal falls back to its
 * right-hand edge, which is where the portal would have gone.
 */
const anchorColumn = (tiles: Tile[][]): number => {
  const carrying = find(tiles, (cells) => includes(cells, TILE_PORTAL));

  return carrying === undefined
    ? size(tiles[0]) - 1
    : indexOf(carrying, TILE_PORTAL);
};

/**
 * Every column, nearest the portal first. Ties fall to the left, so the chest
 * settles on the approach to the exit rather than behind it.
 */
const columnOrder = (width: number, anchor: number): number[] =>
  sortBy(range(0, width), (column) => Math.abs(column - anchor));

/**
 * The row of the first thing that would be landed on, dropping down this
 * column, or -1 when the column is open all the way down with nothing to stand
 * on at all.
 */
const surfaceRow = (tiles: Tile[][], column: number): number =>
  findIndex(tiles, (row) => isSolidTile(row[column]));

/**
 * The chest takes a single cell resting on the ground, so a column works when
 * it has ground and the cell on top of it is clear. Air rather than merely
 * "not solid", which is also what keeps the chest off the portal's own column
 * and out of the spikes.
 */
const isFree = (tiles: Tile[][], column: number): boolean => {
  const surface = surfaceRow(tiles, column);

  return surface >= 1 && tiles[surface - 1][column] === TILE_AIR;
};

/**
 * Sets the chest down at the end of the level, as near the portal as there is
 * room for. The reward sits where the player is already heading, so finishing
 * the level and opening it are the same trip.
 *
 * A level with nowhere to stand comes back unmarked, rather than with the
 * chest buried in the terrain.
 */
export const addChest = (tiles: Tile[][]): Tile[][] => {
  const marked = map(tiles, (row) => [...row]);
  const width = size(marked[0]);
  const column = find(columnOrder(width, anchorColumn(marked)), (candidate) =>
    isFree(marked, candidate),
  );

  if (column === undefined) {
    return marked;
  }

  marked[surfaceRow(marked, column) - 1][column] = TILE_CHEST;

  return marked;
};
