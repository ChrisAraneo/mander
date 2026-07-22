import { TILE_SIZE } from '@mander/generator';

import type { Enemy, Player } from '../state';
import { ENEMY_WIDTH, PLAYER_HEIGHT, PLAYER_WIDTH } from '../state';

const isNear = (enemy: Enemy, player: Player): boolean =>
  Math.abs(player.x + PLAYER_WIDTH / 2 - (enemy.x + ENEMY_WIDTH / 2)) <
  TILE_SIZE * 2.5;

const isAbove = (enemy: Enemy, player: Player): boolean =>
  player.y + PLAYER_HEIGHT <= enemy.y + 6;

export const playerOverhead = (enemy: Enemy, player: Player): boolean =>
  isNear(enemy, player) && isAbove(enemy, player);
