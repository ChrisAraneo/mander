import { filter, flatMap, map, range } from 'lodash-es';

import { SECTOR_WIDTH } from '../../consts';
import { BLOCK, type Structure } from '../types';
import type { Surface } from './surface';

const isTopBlock = (grid: Structure, row: number, column: number): boolean =>
  grid[row][column] === BLOCK && (row === 0 || grid[row - 1][column] !== BLOCK);

export const structureSurfaces = (grid: Structure): Surface[] =>
  flatMap(range(grid.length), (row) =>
    map(
      filter(range(SECTOR_WIDTH), (column) => isTopBlock(grid, row, column)),
      (column): Surface => ({ col: column, height: grid.length - 1 - row }),
    ),
  );
