import { SECTOR_WIDTH } from '../../consts';
import { ENEMY, type Structure } from '../types';
import type { EnemyCell } from './enemy-cell';

export const structureEnemies = (grid: Structure): EnemyCell[] => {
  const cells: EnemyCell[] = [];
  for (const [row, rowCells] of grid.entries()) {
    for (let column = 0; column < SECTOR_WIDTH; column++) {
      if (rowCells[column] === ENEMY) cells.push({ col: column, row });
    }
  }
  return cells;
};
