import type { Enemy } from '@mander/model';
import { isOverlappingHitbox } from '../internal/is-overlapping-hitbox';
import { computeEnemyHitbox } from './compute-enemy-hitbox';

export const areEnemiesOverlapping = (one: Enemy, other: Enemy): boolean =>
  isOverlappingHitbox(computeEnemyHitbox(one), computeEnemyHitbox(other));
