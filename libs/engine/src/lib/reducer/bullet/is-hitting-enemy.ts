import type { Bullet, Enemy } from '@mander/model';

import { ENEMY_HEIGHT, ENEMY_HITBOX_INSET, ENEMY_WIDTH } from '../enemy/consts';
import { BULLET_HITBOX_INSET, BULLET_SIZE } from './consts';

export const isHittingEnemy = (bullet: Bullet, enemy: Enemy): boolean => {
  const bulletLeft = bullet.position.x + BULLET_HITBOX_INSET;
  const bulletRight = bullet.position.x + BULLET_SIZE - BULLET_HITBOX_INSET;
  const bulletTop = bullet.position.y + BULLET_HITBOX_INSET;
  const bulletBottom = bullet.position.y + BULLET_SIZE - BULLET_HITBOX_INSET;

  const enemyLeft = enemy.position.x + ENEMY_HITBOX_INSET;
  const enemyRight = enemy.position.x + ENEMY_WIDTH - ENEMY_HITBOX_INSET;
  const enemyTop = enemy.position.y + ENEMY_HITBOX_INSET;
  const enemyBottom = enemy.position.y + ENEMY_HEIGHT - ENEMY_HITBOX_INSET;

  return (
    bulletLeft < enemyRight &&
    bulletRight > enemyLeft &&
    bulletTop < enemyBottom &&
    bulletBottom > enemyTop
  );
};
