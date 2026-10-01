import type { Tile } from '@mander/model';
import { map } from 'lodash-es';

const NEIGHBOUR_OFFSETS = Object.freeze([
  { row: -1, column: 0 },
  { row: 1, column: 0 },
  { row: 0, column: -1 },
  { row: 0, column: 1 },
  { row: -1, column: -1 },
  { row: -1, column: 1 },
  { row: 1, column: -1 },
  { row: 1, column: 1 },
]);

export const findNeighbourTiles = (
  tiles: Tile[][],
  row: number,
  column: number,
): (Tile | undefined)[] =>
  map(
    NEIGHBOUR_OFFSETS,
    (offset) => tiles[row + offset.row]?.[column + offset.column],
  );
