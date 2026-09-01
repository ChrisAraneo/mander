import { isSolidTile, type Tile, TILE_AIR } from '@mander/model';
import { every, filter, flatMap, map, range, size } from 'lodash-es';

export interface Spot {
  row: number;
  column: number;
}

const isClear = (
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

export const standingSpots = (tiles: Tile[][], clearance: number): Spot[] =>
  flatMap(tiles, (cells, row) =>
    map(
      filter(
        range(size(cells)),
        (column) =>
          isSolidTile(cells[column]) && isClear(tiles, row, column, clearance),
      ),
      (column): Spot => ({ row, column }),
    ),
  );
