import { type Enemy, type Level, MAX_TICK_SECONDS } from '@mander/model';
import { computeFlyingEnemyFacing } from './compute-flying-enemy-facing';
import type { FlyingEnemyFlight } from './types/flying-enemy-flight';

export const computeFlyingEnemyFlight = ({
  level,
  enemy,
  elapsedSeconds,
}: {
  level: Level;
  enemy: Enemy;
  elapsedSeconds: number;
}): FlyingEnemyFlight => ({
  level,
  enemy,
  deltaSeconds: Math.min(elapsedSeconds, MAX_TICK_SECONDS),
  speed: enemy.velocity.y.max,
  facing: computeFlyingEnemyFacing(enemy.velocity.y.current),
});
