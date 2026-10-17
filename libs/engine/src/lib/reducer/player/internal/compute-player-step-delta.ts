import { type Level, MAX_TICK_SECONDS, type Player } from '@mander/model';
import type { InputState } from '../../../types/input-state';
import type { PlayerStepDelta } from './types/player-step-delta';

export const computePlayerStepDelta = ({
  level,
  player,
  input,
  elapsedSeconds,
}: {
  level: Level;
  player: Player;
  input: InputState;
  elapsedSeconds: number;
}): PlayerStepDelta => ({
  level,
  player,
  input,
  deltaSeconds: Math.min(elapsedSeconds, MAX_TICK_SECONDS),
});
