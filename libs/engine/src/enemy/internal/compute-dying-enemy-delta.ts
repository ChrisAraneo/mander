import { type Enemy, type Level, MAX_TICK_SECONDS } from '@mander/model';
import type { DyingEnemyDelta } from './types/dying-enemy-delta';

export const computeDyingEnemyDelta = ({
  level,
  enemy,
  elapsedSeconds,
}: {
  level: Level;
  enemy: Enemy;
  elapsedSeconds: number;
}): DyingEnemyDelta => ({
  level,
  enemy,
  deltaSeconds: Math.min(elapsedSeconds, MAX_TICK_SECONDS),
});
