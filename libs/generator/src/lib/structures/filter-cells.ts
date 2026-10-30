import type { Tile } from '@mander/model';
import { filter, flatMap, map, range, size } from 'lodash-es';
import type { Cell } from '../types/cell';

export const filterCells = (
  tiles: Tile[][],
  isMatch: (tile: Tile) => boolean,
): Cell[] =>
  flatMap(tiles, (cells, row) =>
    map(
      filter(range(size(cells)), (column) => isMatch(cells[column])),
      (column): Cell => ({ row, column }),
    ),
  );
