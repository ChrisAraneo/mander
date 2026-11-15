import type { Enemy, Rectangle } from '@mander/model';
import {
  ENEMY_HEIGHT,
  ENEMY_HITBOX_INSET,
  ENEMY_WIDTH,
} from '../../enemy/consts';

export const computeEnemyBox = (enemy: Enemy): Rectangle => ({
  x: enemy.position.x + ENEMY_HITBOX_INSET,
  y: enemy.position.y + ENEMY_HITBOX_INSET,
  width: ENEMY_WIDTH - 2 * ENEMY_HITBOX_INSET,
  height: ENEMY_HEIGHT - 2 * ENEMY_HITBOX_INSET,
});
