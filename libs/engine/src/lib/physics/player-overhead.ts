import { TILE_SIZE } from '@mander/generator';
import { ENEMY_WIDTH, PLAYER_HEIGHT, PLAYER_WIDTH } from '../state';
import type { Enemy, Player } from '../state';

export function playerOverhead(enemy: Enemy, player: Player): boolean {
  const isNear = Math.abs(player.x + PLAYER_WIDTH / 2 - (enemy.x + ENEMY_WIDTH / 2)) < TILE_SIZE * 2.5;
  const isAbove = player.y + PLAYER_HEIGHT <= enemy.y + 6;
  return isNear && isAbove;
}
