import type { Enemy } from '@mander/model';
import type { Hitbox } from '../types/hitbox';
import { ENEMY_HEIGHT, ENEMY_HITBOX_INSET, ENEMY_WIDTH } from './consts';

export const computeEnemyHitbox = (enemy: Enemy): Hitbox => ({
  left: enemy.position.x + ENEMY_HITBOX_INSET,
  right: enemy.position.x + ENEMY_WIDTH - ENEMY_HITBOX_INSET,
  top: enemy.position.y + ENEMY_HITBOX_INSET,
  bottom: enemy.position.y + ENEMY_HEIGHT - ENEMY_HITBOX_INSET,
});
