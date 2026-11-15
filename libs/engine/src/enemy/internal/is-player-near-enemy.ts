import { type Enemy, type Player, TILE_SIZE } from '@mander/model';
import { PLAYER_WIDTH } from '../../player/consts';
import { ENEMY_WIDTH } from '../consts';

const OVERHEAD_RANGE_TILES = 2.5;

export const isPlayerNearEnemy = (enemy: Enemy, player: Player): boolean =>
  Math.abs(
    player.position.x + PLAYER_WIDTH / 2 - (enemy.position.x + ENEMY_WIDTH / 2),
  ) <
  TILE_SIZE * OVERHEAD_RANGE_TILES;
