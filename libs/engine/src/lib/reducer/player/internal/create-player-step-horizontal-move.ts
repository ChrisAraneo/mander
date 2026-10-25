import type { AxisMove } from '../../collision/types/axis-move';
import { computeBlockedVelocityX } from './compute-blocked-velocity-x';
import type { PlayerStepFall } from './types/player-step-fall';
import type { PlayerStepHorizontalMove } from './types/player-step-horizontal-move';

export const createPlayerStepHorizontalMove = (
  {
    level,
    player,
    deltaSeconds,
    velocityX,
    isFacingRight,
    velocityY,
    isGrounded,
  }: PlayerStepFall,
  { position, isBlocked }: AxisMove,
): PlayerStepHorizontalMove => ({
  level,
  player,
  deltaSeconds,
  isFacingRight,
  velocityY,
  isGrounded,
  nextX: position,
  blockedVelocityX: computeBlockedVelocityX(isBlocked, velocityX),
});
