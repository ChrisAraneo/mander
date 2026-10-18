import type { Enemy, Point } from '@mander/model';
import { computeEnemyHitbox } from '../../enemy/compute-enemy-hitbox';
import { isOverlappingHitbox } from '../../internal/is-overlapping-hitbox';
import { computeFireballHitbox } from './compute-fireball-hitbox';

export const isFireballHittingEnemy = (centre: Point, enemy: Enemy): boolean =>
  isOverlappingHitbox(computeFireballHitbox(centre), computeEnemyHitbox(enemy));
