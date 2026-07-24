import { every, range } from 'lodash-es';

import { PLAYER_CLEARANCE } from '../../consts';
import { BLOCK, type Structure } from '../types';
import type { Surface } from './surface';

const isBlock = (grid: Structure, row: number, column: number): boolean =>
  row >= 0 && row < grid.length && grid[row][column] === BLOCK;

export const surfaceHasHeadroom = (
  grid: Structure,
  surface: Surface,
): boolean => {
  const surfaceRow = grid.length - 1 - surface.height;
  return every(
    range(1, PLAYER_CLEARANCE + 1),
    (offset) => !isBlock(grid, surfaceRow - offset, surface.col),
  );
};
