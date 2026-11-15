import type { Random } from '@mander/common';
import type { Tile } from '@mander/model';
import type { Cell } from '../../../types/cell';
import type { EnemyChances } from '../../../types/enemy-chances';

export interface EnemyCells {
  tiles: Tile[][];
  chances: EnemyChances;
  cells: Cell[];
  random: Random;
}
