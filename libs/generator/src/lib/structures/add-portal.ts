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

/** The portal stands two tiles tall, the way the entity box measures it. */
const PORTAL_HEIGHT = 2;

/**
 * How far in from the right edge to try, in order. The way out sits just
 * inside the level rather than flush against the wall, so the second to last
 * column is asked first and the edge itself is only taken once the room beside
 * it is spoken for. Further back is a last resort, walking left.
 */
const PREFERRED_OFFSETS = [1, 2, 3, 0];

const columnOrder = (width: number): number[] =>
  filter(
    map(
      concat(PREFERRED_OFFSETS, range(size(PREFERRED_OFFSETS), width)),
      (offset) => width - 1 - offset,
    ),
    (column) => column >= 0,
  );

/**
 * The row of the first thing that would be landed on, dropping down this
 * column, or -1 when the column is open all the way down with nothing to stand
 * on at all.
 */
const surfaceRow = (tiles: Tile[][], column: number): number =>
  findIndex(tiles, (row) => isSolidTile(row[column]));

const stackRows = (surface: number): number[] =>
  map(range(1, PORTAL_HEIGHT + 1), (offset) => surface - offset);

/**
 * A column is free when it has ground and the portal's own height of clear air
 * directly above it. Air rather than merely "not solid", which also keeps the
 * portal off a column already holding the player's spawn.
 */
const isFree = (tiles: Tile[][], column: number): boolean => {
  const surface = surfaceRow(tiles, column);

  return (
    surface >= PORTAL_HEIGHT &&
    every(stackRows(surface), (row) => tiles[row][column] === TILE_AIR)
  );
};

/**
 * Marks the way out of the level: a stack of portal tiles standing on the
 * ground near the right edge. `findPortalTile` takes the top of the stack and
 * walks down to the tile it stands on, so the pair reads as one doorway.
 *
 * A level with nowhere to stand comes back unmarked, rather than with the
 * portal buried in the terrain.
 */
export const addPortal = (tiles: Tile[][]): Tile[][] => {
  const marked = map(tiles, (row) => [...row]);
  const column = find(columnOrder(size(marked[0])), (candidate) =>
    isFree(marked, candidate),
  );

  if (column === undefined) {
    return marked
  }

  forEach(stackRows(surfaceRow(marked, column)), (row) => {
    marked[row][column] = TILE_PORTAL;
  });

  return marked;
};
