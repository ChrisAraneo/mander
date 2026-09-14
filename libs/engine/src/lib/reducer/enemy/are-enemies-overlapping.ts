import type { Enemy } from '@mander/model';

import { ENEMY_HEIGHT, ENEMY_HITBOX_INSET, ENEMY_WIDTH } from './consts';

const getLeft = (enemy: Enemy): number => enemy.position.x + ENEMY_HITBOX_INSET;

const getRight = (enemy: Enemy): number =>
  enemy.position.x + ENEMY_WIDTH - ENEMY_HITBOX_INSET;

const getTop = (enemy: Enemy): number => enemy.position.y + ENEMY_HITBOX_INSET;

const getBottom = (enemy: Enemy): number =>
  enemy.position.y + ENEMY_HEIGHT - ENEMY_HITBOX_INSET;

export const areEnemiesOverlapping = (one: Enemy, other: Enemy): boolean =>
  getLeft(one) < getRight(other) &&
  getRight(one) > getLeft(other) &&
  getTop(one) < getBottom(other) &&
  getBottom(one) > getTop(other);
