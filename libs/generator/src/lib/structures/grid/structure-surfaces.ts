import { SECTOR_WIDTH } from '../../consts';
import { BLOCK, type Structure } from '../types';
import type { Surface } from './surface';

export function structureSurfaces(grid: Structure): Surface[] {
  const rowCount = grid.length;
  const surfaces: Surface[] = [];
  for (let row = 0; row < rowCount; row++) {
    for (let column = 0; column < SECTOR_WIDTH; column++) {
      if (grid[row][column] !== BLOCK) continue;
      if (row > 0 && grid[row - 1][column] === BLOCK) continue;
      surfaces.push({ col: column, height: rowCount - 1 - row });
    }
  }
  return surfaces;
}
