import { isSolidTile, type Tile, TILE_AIR, TILE_KEY } from '@mander/model';
import { SECTOR_WIDTH } from '@mander/structures';
import { find, findIndex, floor, map, range, size, sortBy } from 'lodash-es';

/**
 * The seam the key is hung on: the start of whichever structure the middle of
 * the level falls in, which is also where the structure to its left runs out.
 */
const middleSeam = (width: number): number =>
  floor(width / 2 / SECTOR_WIDTH) * SECTOR_WIDTH;

/**
 * Every column, nearest the seam first. Ties fall to the left, so a key that
 * cannot sit on the seam itself backs into the tail of the structure before it
 * rather than wandering into the one after.
 */
const columnOrder = (width: number, seam: number): number[] =>
  sortBy(range(0, width), (column) => Math.abs(column - seam));

/**
 * The row of the first thing that would be landed on, dropping down this
 * column, or -1 when the column is open all the way down with nothing to stand
 * on at all.
 */
const surfaceRow = (tiles: Tile[][], column: number): number =>
  findIndex(tiles, (row) => isSolidTile(row[column]));

/**
 * The key takes a single cell resting on the ground, so a column works when it
 * has ground and the cell on top of it is clear. Air rather than merely "not
 * solid": a spike or an enemy already standing there has the spot.
 */
const isFree = (tiles: Tile[][], column: number): boolean => {
  const surface = surfaceRow(tiles, column);

  return surface >= 1 && tiles[surface - 1][column] === TILE_AIR;
};

/**
 * Hangs the key halfway along the level, at the join between two structures.
 * Putting it on a seam rather than anywhere in the open means the player has
 * to have worked through the first half of the level to reach it, whichever
 * structures the seed happened to deal.
 *
 * A level with nowhere to stand comes back unmarked, rather than with the key
 * buried in the terrain.
 */
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
