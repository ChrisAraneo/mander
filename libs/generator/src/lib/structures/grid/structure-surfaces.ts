import { SECTOR_WIDTH } from '../../consts';
import { BLOCK, type Structure } from '../types';
import type { Surface } from './surface';

export const structureSurfaces = (grid: Structure): Surface[] => {
  const rowCount = grid.length;
  const surfaces: Surface[] = [];
  for (let row = 0; row < rowCount; row++) {
    for (let column = 0; column < SECTOR_WIDTH; column++) {
      const isTopBlock =
        grid[row][column] === BLOCK &&
        (row === 0 || grid[row - 1][column] !== BLOCK);
      if (isTopBlock) {
        surfaces.push({ col: column, height: rowCount - 1 - row });
      }
    }
  }
  return surfaces;
};
