import { isSolidTile, type Tile } from '@mander/model';
import { filter, flatMap, map, range, size } from 'lodash-es';
import type { Spot } from '../types/spot';
import { isClear } from './internal/is-clear';

const filterStandingColumns = (
  tiles: Tile[][],
  row: Tile[],
  rowIndex: number,
  clearance: number,
): number[] =>
  filter(
    range(size(row)),
    (column) =>
      isSolidTile(row[column]) && isClear(tiles, rowIndex, column, clearance),
  );

const toSpots = (columns: number[], rowIndex: number): Spot[] =>
  map(columns, (column): Spot => ({ row: rowIndex, column }));

export const filterStandingSpots = (
  tiles: Tile[][],
  clearance: number,
): Spot[] =>
  flatMap(tiles, (row, rowIndex) =>
    toSpots(filterStandingColumns(tiles, row, rowIndex, clearance), rowIndex),
  );
