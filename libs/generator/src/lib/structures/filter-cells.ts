import type { Tile } from '@mander/model';
import { filter, flatMap, map, range, size } from 'lodash-es';
import type { Cell } from '../types/cell';

const filterMatchingColumns = (
  row: Tile[],
  isMatch: (tile: Tile) => boolean,
): number[] => filter(range(size(row)), (column) => isMatch(row[column]));

const toCells = (columns: number[], rowIndex: number): Cell[] =>
  map(columns, (column): Cell => ({ row: rowIndex, column }));

export const filterCells = (
  tiles: Tile[][],
  isMatch: (tile: Tile) => boolean,
): Cell[] =>
  flatMap(tiles, (row, rowIndex) =>
    toCells(filterMatchingColumns(row, isMatch), rowIndex),
  );
