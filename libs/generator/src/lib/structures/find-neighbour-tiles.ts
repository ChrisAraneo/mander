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

export const findNeighbourTiles = (
  tiles: Tile[][],
  row: number,
  column: number,
) => map(NEIGHBOURS, ([stepX, stepY]) => tiles[row + stepY]?.[column + stepX]);
