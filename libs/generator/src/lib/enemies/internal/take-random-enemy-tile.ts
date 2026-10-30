import type { Random } from '@mander/engine';
import { isGroundEnemyTile, type Tile, TILE_ENEMY_FLYING } from '@mander/model';
import { match } from 'ts-pattern';
import type { Cell } from '../../types/cell';
import type { EnemyChances } from '../../types/enemy-chances';
import { isAirborneCell } from './is-airborne-cell';
import { takeRandomGroundEnemyTile } from './take-random-ground-enemy-tile';

export const takeRandomEnemyTile = (
  tiles: Tile[][],
  cell: Cell,
  chances: EnemyChances,
  random: Random,
): Tile =>
  match({
    isAirborne: isAirborneCell(tiles, cell),
    isGroundEnemy: isGroundEnemyTile(tiles[cell.row][cell.column]),
  })
    .with({ isAirborne: true }, () => TILE_ENEMY_FLYING)
    .with({ isGroundEnemy: true }, () => tiles[cell.row][cell.column])
    .otherwise(() => takeRandomGroundEnemyTile(chances, random));
