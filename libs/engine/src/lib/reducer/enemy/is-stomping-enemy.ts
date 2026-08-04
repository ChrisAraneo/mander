import type { Enemy, Player } from '@mander/model';

import { PLAYER_HEIGHT, PLAYER_HITBOX_INSET_BOTTOM } from '../player/consts';
import { ENEMY_HITBOX_INSET } from './consts';

// Only meaningful once isTouchingEnemy already holds for the current frame.
// Checked against the player's position from BEFORE this tick's movement,
// rather than how deep the current-frame overlap is: a fast fall can cover
// more than the enemy's whole height in a single tick, so a fixed "shallow
// depth" test can tunnel straight past it and misread a clean headshot as a
// side hit. If the player was above the enemy's head a moment ago and is
// still falling, this is a stomp no matter how deep it lands this frame.
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
