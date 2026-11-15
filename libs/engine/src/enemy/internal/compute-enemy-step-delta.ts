import {
  type Enemy,
  type Level,
  MAX_TICK_SECONDS,
  type Player,
} from '@mander/model';
import type { EnemyStepDelta } from './types/enemy-step-delta';

export const computeEnemyStepDelta = ({
  level,
  enemy,
  player,
  elapsedSeconds,
}: {
  level: Level;
  enemy: Enemy;
  player: Player;
  elapsedSeconds: number;
}): EnemyStepDelta => ({
  level,
  enemy,
  player,
  deltaSeconds: Math.min(elapsedSeconds, MAX_TICK_SECONDS),
});
