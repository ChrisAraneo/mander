import type { Enemy, Level } from '@mander/model';
import { pipe } from 'remeda';
import { computeDyingEnemyDelta } from './compute-dying-enemy-delta';
import { computeDyingEnemyDrop } from './compute-dying-enemy-drop';
import { computeDyingEnemyFall } from './compute-dying-enemy-fall';
import { patchDyingEnemyDrop } from './patch-dying-enemy-drop';

export const patchDyingEnemy = (
  level: Level,
  enemy: Enemy,
  elapsedSeconds: number,
): Enemy =>
  pipe(
    { level, enemy, elapsedSeconds },
    computeDyingEnemyDelta,
    computeDyingEnemyFall,
    computeDyingEnemyDrop,
    patchDyingEnemyDrop,
  );
