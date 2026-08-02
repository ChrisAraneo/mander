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

/** How far back from the portal the chest is set down, given the room. */
const PORTAL_GAP = 2;

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
 * Two clear of the portal first, then back along the level. Never to the right
 * of that: the chest belongs on the approach, where the player passes it on
 * the way to the exit rather than after taking it.
 */
const columnOrder = (anchor: number): number[] =>
  range(anchor - PORTAL_GAP, -1, -1);

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
 * Sets the chest down at the end of the level, two clear of the portal where
 * there is room for it and further back along the level where there is not.
 * The gap is what keeps the two apart: standing between them, the player is in
 * reach of one thing at a time and the prompt says which.
 *
 * A level with nowhere to stand comes back unmarked, rather than with the
 * chest buried in the terrain.
 */
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
