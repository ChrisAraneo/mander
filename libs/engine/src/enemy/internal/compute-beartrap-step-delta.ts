import {
  type Enemy,
  type Level,
  MAX_TICK_SECONDS,
  type Player,
} from '@mander/model';
import type { BeartrapStepDelta } from './types/beartrap-step-delta';

export const computeBeartrapStepDelta = ({
  level,
  trap,
  player,
  elapsedSeconds,
}: {
  level: Level;
  trap: Enemy;
  player: Player;
  elapsedSeconds: number;
}): BeartrapStepDelta => ({
  level,
  trap,
  player,
  deltaSeconds: Math.min(elapsedSeconds, MAX_TICK_SECONDS),
});
