import { computePlayerHorizontalMove } from './compute-player-horizontal-move';
import { createPlayerStepHorizontalMove } from './create-player-step-horizontal-move';
import type { PlayerStepFall } from './types/player-step-fall';
import type { PlayerStepHorizontalMove } from './types/player-step-horizontal-move';

export const computePlayerStepHorizontalMove = (
  fall: PlayerStepFall,
): PlayerStepHorizontalMove =>
  createPlayerStepHorizontalMove(fall, computePlayerHorizontalMove(fall));
