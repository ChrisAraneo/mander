import { map, takeRightWhile } from 'lodash-es';

import { BLOCK, type Structure } from '../types';

export const groundHeight = (grid: Structure, column: number): number =>
  takeRightWhile(
    map(grid, (row) => row[column]),
    (cell) => cell === BLOCK,
  ).length;
