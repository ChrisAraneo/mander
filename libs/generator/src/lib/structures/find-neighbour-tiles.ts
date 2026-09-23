import type { Tile } from '@mander/model';
import { map } from 'lodash-es';

const NEIGHBOURS: readonly number[][] = Object.freeze([
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
]);

// the eight tiles around a spot, in a fixed order, with the ones that fall off
// the grid left as gaps: the callers decide what counts as a neighbour they can
// use, and the order settles any tie between equally common ones
export const findNeighbourTiles = (
  tiles: Tile[][],
  row: number,
  column: number,
) => map(NEIGHBOURS, ([stepX, stepY]) => tiles[row + stepY]?.[column + stepX]);
