import type { Enemy, Player } from '../state';
import {
  ENEMY_HEIGHT,
  ENEMY_HITBOX_INSET,
  ENEMY_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_HITBOX_INSET_BOTTOM,
  PLAYER_HITBOX_INSET_TOP,
  PLAYER_HITBOX_INSET_X,
  PLAYER_WIDTH,
} from '../state';

export const isTouchingEnemy = (player: Player, enemy: Enemy): boolean => {
  const playerLeft = player.position.x + PLAYER_HITBOX_INSET_X;
  const playerRight = player.position.x + PLAYER_WIDTH - PLAYER_HITBOX_INSET_X;
  const playerTop = player.position.y + PLAYER_HITBOX_INSET_TOP;
  const playerBottom =
    player.position.y + PLAYER_HEIGHT - PLAYER_HITBOX_INSET_BOTTOM;

  const enemyLeft = enemy.position.x + ENEMY_HITBOX_INSET;
  const enemyRight = enemy.position.x + ENEMY_WIDTH - ENEMY_HITBOX_INSET;
  const enemyTop = enemy.position.y + ENEMY_HITBOX_INSET;
  const enemyBottom = enemy.position.y + ENEMY_HEIGHT - ENEMY_HITBOX_INSET;

  return (
    playerLeft < enemyRight &&
    playerRight > enemyLeft &&
    playerTop < enemyBottom &&
    playerBottom > enemyTop
  );
};
