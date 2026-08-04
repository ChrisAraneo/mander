import { aliasOf } from '@mander/structures';
import { join, map } from 'lodash-es';

const formatRow = (row: number[]): string =>
  `  [${join(
    map(row, (cell) => aliasOf(cell)),
    ', ',
  )}],`;

export const formatStructure = (grid: number[][]): string =>
  `[\n${join(map(grid, formatRow), '\n')}\n]`;
