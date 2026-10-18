import type { Tile } from '@mander/model';
import { filter, flatMap, map, range, size } from 'lodash-es';
import type { Cell } from '../types/cell';

export const filterTileCells = (tiles: Tile[][], tile: Tile): Cell[] =>
  flatMap(tiles, (cells, row) =>
    map(
      filter(range(size(cells)), (column) => cells[column] === tile),
      (column): Cell => ({ row, column }),
    ),
  );
