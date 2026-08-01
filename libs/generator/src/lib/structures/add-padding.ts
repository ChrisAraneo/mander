import { type Tile, TILE_AIR } from '@mander/model';
import { findLastIndex, last, map, size, some, times } from 'lodash-es';

/** Rows kept under the lowest thing in the level, so the ground has body. */
const GROUND_DEPTH = 4;

/** Rows of open sky added over the top for the player to jump into. */
const SKY_HEIGHT = 20;

const lowestFilledRow = (tiles: Tile[][]): number =>
  findLastIndex(tiles, (row) => some(row, (tile) => tile !== TILE_AIR));

/**
 * How many rows the floor is short of the depth it should carry. A level whose
 * lowest tile already stands clear of the bottom needs none, so the padding
 * only ever deepens the ground rather than moving it.
 */
const missingDepth = (tiles: Tile[][]): number => {
  const lowest = lowestFilledRow(tiles);

  if (lowest < 0) {
    return 0;
  }

  return Math.max(0, GROUND_DEPTH - (size(tiles) - 1 - lowest));
};

/**
 * Gives the joined level room at both ends: the bottom row is stretched down
 * so the ground reads as ground rather than a crust one tile thick, and open
 * sky goes over the top so a jump at full height has somewhere to go.
 *
 * The floor is stretched by repeating the bottom row, so a column that ran out
 * as a pit stays a pit — it only gets deeper.
 */
export const addPadding = (tiles: Tile[][]): Tile[][] => {
  if (size(tiles) === 0) {
    return [];
  }

  const floor = last(tiles) ?? [];
  const sky = times(SKY_HEIGHT, () => times(size(floor), (): Tile => TILE_AIR));
  const bedrock = times(missingDepth(tiles), () => [...floor]);

  return [...sky, ...map(tiles, (row) => [...row]), ...bedrock];
};
