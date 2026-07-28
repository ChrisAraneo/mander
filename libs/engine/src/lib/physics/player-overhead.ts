import { TILE_SIZE } from '../world';

import type { Enemy, Player } from '../state';
import { ENEMY_WIDTH, isAlive, PLAYER_HEIGHT, PLAYER_WIDTH } from '../state';

const isNear = (enemy: Enemy, player: Player): boolean =>
  Math.abs(
    player.position.x + PLAYER_WIDTH / 2 - (enemy.position.x + ENEMY_WIDTH / 2),
  ) <
  TILE_SIZE * 2.5;

const isAbove = (enemy: Enemy, player: Player): boolean =>
  player.position.y + PLAYER_HEIGHT <= enemy.position.y + 6;

export const playerOverhead = (enemy: Enemy, player: Player): boolean =>
  isAlive(player) && isNear(enemy, player) && isAbove(enemy, player);
