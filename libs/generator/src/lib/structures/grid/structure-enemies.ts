import { SECTOR_WIDTH } from '../../consts';
import { ENEMY, type Structure } from '../types';
import type { EnemyCell } from './enemy-cell';

export function structureEnemies(grid: Structure): EnemyCell[] {
  const cells: EnemyCell[] = [];
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < SECTOR_WIDTH; column++) {
      if (grid[row][column] === ENEMY) cells.push({ col: column, row });
    }
  }
  return cells;
}
