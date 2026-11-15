import { TERMINAL_VELOCITY } from '@mander/model';
import { computePlayerGravity } from './compute-player-gravity';
import type { PlayerStepFall } from './types/player-step-fall';
import type { PlayerStepIntent } from './types/player-step-intent';

export const computePlayerStepFall = ({
  level,
  player,
  input,
  deltaSeconds,
  velocityX,
  isFacingRight,
  velocityY,
  isGrounded,
}: PlayerStepIntent): PlayerStepFall => ({
  level,
  player,
  deltaSeconds,
  velocityX,
  isFacingRight,
  velocityY: Math.min(
    velocityY + computePlayerGravity(velocityY, input) * deltaSeconds,
    TERMINAL_VELOCITY,
  ),
  isGrounded,
});
