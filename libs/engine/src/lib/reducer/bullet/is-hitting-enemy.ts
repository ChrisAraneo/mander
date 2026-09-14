import type { Bullet, Enemy } from '@mander/model';

import { ENEMY_HEIGHT, ENEMY_HITBOX_INSET, ENEMY_WIDTH } from '../enemy/consts';
import { bulletBox } from './bullet-box';
import { isOverlappingBox } from './is-overlapping-box';

export const isHittingEnemy = (bullet: Bullet, enemy: Enemy): boolean =>
  isOverlappingBox(bulletBox(bullet), {
    x: enemy.position.x + ENEMY_HITBOX_INSET,
    y: enemy.position.y + ENEMY_HITBOX_INSET,
    width: ENEMY_WIDTH - 2 * ENEMY_HITBOX_INSET,
    height: ENEMY_HEIGHT - 2 * ENEMY_HITBOX_INSET,
  });
