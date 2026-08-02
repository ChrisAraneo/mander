import { type Enemy, type Player, TILE_SIZE } from '@mander/model';

import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { isAlive } from '../player/is-alive';
import { ENEMY_WIDTH } from './consts';

const isNear = (enemy: Enemy, player: Player): boolean =>
  Math.abs(
    player.position.x + PLAYER_WIDTH / 2 - (enemy.position.x + ENEMY_WIDTH / 2),
  ) <
  TILE_SIZE * 2.5;

const isAbove = (enemy: Enemy, player: Player): boolean =>
  player.position.y + PLAYER_HEIGHT <= enemy.position.y + 6;

export const playerOverhead = (enemy: Enemy, player: Player): boolean =>
  isAlive(player) && isNear(enemy, player) && isAbove(enemy, player);
