import type { Enemy } from '@mander/model';

import { ENEMY_HEIGHT, ENEMY_HITBOX_INSET, ENEMY_WIDTH } from './consts';

const leftOf = (enemy: Enemy): number => enemy.position.x + ENEMY_HITBOX_INSET;

const rightOf = (enemy: Enemy): number =>
  enemy.position.x + ENEMY_WIDTH - ENEMY_HITBOX_INSET;

const topOf = (enemy: Enemy): number => enemy.position.y + ENEMY_HITBOX_INSET;

const bottomOf = (enemy: Enemy): number =>
  enemy.position.y + ENEMY_HEIGHT - ENEMY_HITBOX_INSET;

export const enemiesOverlap = (one: Enemy, other: Enemy): boolean =>
  leftOf(one) < rightOf(other) &&
  rightOf(one) > leftOf(other) &&
  topOf(one) < bottomOf(other) &&
  bottomOf(one) > topOf(other);
