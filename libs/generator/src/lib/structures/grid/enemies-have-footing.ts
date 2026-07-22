import { every } from 'lodash-es';
import { BLOCK, type Structure } from '../types';
import { structureEnemies } from './structure-enemies';

export function enemiesHaveFooting(grid: Structure): boolean {
  return every(
    structureEnemies(grid),
    ({ col, row }) => row + 1 < grid.length && grid[row + 1][col] === BLOCK
  );
}
