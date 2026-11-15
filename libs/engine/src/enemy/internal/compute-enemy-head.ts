import type { Enemy } from '@mander/model';
import { ENEMY_HITBOX_INSET } from '../consts';

export const computeEnemyHead = (enemy: Enemy): number =>
  enemy.position.y + ENEMY_HITBOX_INSET;
