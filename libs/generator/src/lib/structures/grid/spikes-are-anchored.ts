import { every, range } from 'lodash-es';

import { SECTOR_WIDTH, STRUCTURE_HEIGHT } from '../../consts';
import { BLOCK, SPIKE, SPIKE_CEILING, type Structure } from '../types';

const anchored = (grid: Structure, row: number, column: number): boolean => {
  const cell = grid[row][column];
  if (cell === SPIKE)
    return row + 1 < STRUCTURE_HEIGHT && grid[row + 1][column] === BLOCK;
  if (cell === SPIKE_CEILING)
    return row - 1 >= 0 && grid[row - 1][column] === BLOCK;
  return true;
};

export const spikesAreAnchored = (grid: Structure): boolean =>
  every(range(STRUCTURE_HEIGHT), (row) =>
    every(range(SECTOR_WIDTH), (column) => anchored(grid, row, column)),
  );
