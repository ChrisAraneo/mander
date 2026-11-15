import { computePlayerWalk } from './compute-player-walk';
import type { PlayerStepFall } from './types/player-step-fall';
import type { PlayerStepHorizontalMove } from './types/player-step-horizontal-move';

export const computePlayerStepHorizontalMove = ({
  level,
  player,
  deltaSeconds,
  velocityX,
  isFacingRight,
  velocityY,
  isGrounded,
}: PlayerStepFall): PlayerStepHorizontalMove => ({
  level,
  player,
  deltaSeconds,
  isFacingRight,
  velocityY,
  isGrounded,
  ...computePlayerWalk(level, player, deltaSeconds, velocityX),
});
