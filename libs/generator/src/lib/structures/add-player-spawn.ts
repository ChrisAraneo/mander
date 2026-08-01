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

/** The player stands two tiles tall, so the spawn is a pair stacked upright. */
const SPAWN_HEIGHT = 2;

/**
 * Columns to try, in order. The player is meant to start just inside the level
 * rather than jammed against the wall, so the second column is asked first and
 * the edge itself is only taken once the room beside it is spoken for. Further
 * in is a last resort, tried left to right.
 */
const PREFERRED_COLUMNS = [1, 2, 3, 0];

const columnOrder = (width: number): number[] =>
  filter(
    concat(PREFERRED_COLUMNS, range(size(PREFERRED_COLUMNS), width)),
    (column) => column < width,
  );

/**
 * The row of the first thing the player would land on, dropping down this
 * column, or -1 when the column is open all the way down with nothing to stand
 * on at all.
 */
const surfaceRow = (tiles: Tile[][], column: number): number =>
  findIndex(tiles, (row) => isSolidTile(row[column]));

const stackRows = (surface: number): number[] =>
  map(range(1, SPAWN_HEIGHT + 1), (offset) => surface - offset);

/**
 * A column is free when it has ground and the player's own height of clear air
 * directly above it. Air rather than merely "not solid": a spike or an enemy
 * standing there is exactly what the spawn must not be dropped into.
 */
const isFree = (tiles: Tile[][], column: number): boolean => {
  const surface = surfaceRow(tiles, column);

  return (
    surface >= SPAWN_HEIGHT &&
    every(stackRows(surface), (row) => tiles[row][column] === TILE_AIR)
  );
};

/**
 * Marks where the player comes into the level: a stack of spawn tiles standing
 * on the ground near the left edge. They are notes to the engine rather than
 * anything drawn — `spawnPosition` reads the upper of the pair.
 *
 * A level with nowhere to stand comes back unmarked, rather than with the
 * player buried in the terrain.
 */
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
