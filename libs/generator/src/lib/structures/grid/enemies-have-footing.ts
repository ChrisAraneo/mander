import { every } from 'lodash-es';

import { isBlockCell, type Structure } from '../types';
import { structureEnemies } from './structure-enemies';

export const enemiesHaveFooting = (grid: Structure): boolean =>
  every(
    structureEnemies(grid),
    ({ col, row }) => row + 1 < grid.length && isBlockCell(grid[row + 1][col]),
  );
