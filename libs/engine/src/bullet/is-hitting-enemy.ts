import type { Bullet, Enemy } from '@mander/model';
import { computeBulletBox } from './internal/compute-bullet-box';
import { computeEnemyBox } from './internal/compute-enemy-box';
import { isOverlappingBox } from './internal/is-overlapping-box';

export const isHittingEnemy = (bullet: Bullet, enemy: Enemy): boolean =>
  isOverlappingBox(computeBulletBox(bullet), computeEnemyBox(enemy));
