import { filter, flatMap, map, range } from 'lodash-es';

import { SECTOR_WIDTH } from '../../consts';
import { isBlockCell, type Structure } from '../types';
import type { Surface } from './surface';

const isTopBlock = (grid: Structure, row: number, column: number): boolean =>
  isBlockCell(grid[row][column]) &&
  (row === 0 || !isBlockCell(grid[row - 1][column]));

export const structureSurfaces = (grid: Structure): Surface[] =>
  flatMap(range(grid.length), (row) =>
    map(
      filter(range(SECTOR_WIDTH), (column) => isTopBlock(grid, row, column)),
      (column): Surface => ({ col: column, height: grid.length - 1 - row }),
    ),
  );
