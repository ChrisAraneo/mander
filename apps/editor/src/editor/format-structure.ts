import { aliasOf } from '@mander/structures';
import { join, map } from 'lodash-es';

const formatRow = (row: number[]): string =>
  `  [${join(
    map(row, (cell) => aliasOf(cell)),
    ', ',
  )}],`;

/**
 * The grid as it is written in a structure file: alias names rather than the
 * numbers behind them, so what the panel shows can be pasted straight in.
 */
export const formatStructure = (grid: number[][]): string =>
  `[\n${join(map(grid, formatRow), '\n')}\n]`;
