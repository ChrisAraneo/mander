import { map, takeRightWhile } from 'lodash-es';

import { isBlockCell, type Structure } from '../types';

export const groundHeight = (grid: Structure, column: number): number =>
  takeRightWhile(
    map(grid, (row) => row[column]),
    (cell) => isBlockCell(cell),
  ).length;
