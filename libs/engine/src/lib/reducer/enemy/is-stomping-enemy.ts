import type { Enemy, Player } from '@mander/model';

import { PLAYER_HEIGHT, PLAYER_HITBOX_INSET_BOTTOM } from '../player/consts';
import { ENEMY_HITBOX_INSET } from './consts';

export const isStompingEnemy = (
  previousPlayer: Player,
  player: Player,
  enemy: Enemy,
): boolean => {
  const previousPlayerBottom =
    previousPlayer.position.y + PLAYER_HEIGHT - PLAYER_HITBOX_INSET_BOTTOM;
  const enemyTop = enemy.position.y + ENEMY_HITBOX_INSET;

  return player.velocity.y.current > 0 && previousPlayerBottom <= enemyTop;
};
