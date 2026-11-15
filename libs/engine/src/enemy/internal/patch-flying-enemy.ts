import type { Enemy, Level } from '@mander/model';
import { pipe } from 'remeda';
import { computeFlyingEnemyDrift } from './compute-flying-enemy-drift';
import { computeFlyingEnemyFlight } from './compute-flying-enemy-flight';
import { computeFlyingEnemyTarget } from './compute-flying-enemy-target';
import { patchFlyingEnemyDrift } from './patch-flying-enemy-drift';

export const patchFlyingEnemy = (
  level: Level,
  enemy: Enemy,
  elapsedSeconds: number,
): Enemy =>
  pipe(
    { level, enemy, elapsedSeconds },
    computeFlyingEnemyFlight,
    computeFlyingEnemyTarget,
    computeFlyingEnemyDrift,
    patchFlyingEnemyDrift,
  );
