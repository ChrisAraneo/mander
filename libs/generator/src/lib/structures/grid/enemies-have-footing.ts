import { every } from 'lodash-es';

import { BLOCK, type Structure } from '../types';
import { structureEnemies } from './structure-enemies';

export const enemiesHaveFooting = (grid: Structure): boolean =>
  every(
    structureEnemies(grid),
    ({ col, row }) => row + 1 < grid.length && grid[row + 1][col] === BLOCK,
  );
