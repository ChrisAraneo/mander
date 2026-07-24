import { filter, flatMap, map, range } from 'lodash-es';

import { SECTOR_WIDTH } from '../../consts';
import { ENEMY, type Structure } from '../types';
import type { EnemyCell } from './enemy-cell';

export const structureEnemies = (grid: Structure): EnemyCell[] =>
  flatMap(grid, (rowCells, row) =>
    map(
      filter(range(SECTOR_WIDTH), (column) => rowCells[column] === ENEMY),
      (column): EnemyCell => ({ col: column, row }),
    ),
  );
