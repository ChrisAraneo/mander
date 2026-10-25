import { type Tile, TILE_AIR } from '@mander/model';
import { every, range } from 'lodash-es';

export const isClear = (
  tiles: Tile[][],
  row: number,
  column: number,
  clearance: number,
): boolean =>
  row >= clearance &&
  every(
    range(1, clearance + 1),
    (offset) => tiles[row - offset][column] === TILE_AIR,
  );
