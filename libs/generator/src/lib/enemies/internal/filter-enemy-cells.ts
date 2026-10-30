import type { Random } from '@mander/engine';
import { isEnemyTile, type Tile } from '@mander/model';
import { filterCells } from '../../structures/filter-cells';
import type { EnemyChances } from '../../types/enemy-chances';
import type { EnemyCells } from './types/enemy-cells';

export const filterEnemyCells = ({
  tiles,
  chances,
  random,
}: {
  tiles: Tile[][];
  chances: EnemyChances;
  random: Random;
}): EnemyCells => ({
  tiles,
  chances,
  cells: filterCells(tiles, isEnemyTile),
  random,
});
