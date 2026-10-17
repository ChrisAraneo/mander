import { type Enemy, MAX_TICK_SECONDS } from '@mander/model';
import { computeEnemyHead } from './compute-enemy-head';

export const computeEnemyHeadBeforeHop = (
  enemy: Enemy,
  deltaSeconds: number,
): number =>
  computeEnemyHead(enemy) -
  Math.min(0, enemy.velocity.y.current) *
    Math.min(deltaSeconds, MAX_TICK_SECONDS);
