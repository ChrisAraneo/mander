import { computeHorizontalMove } from '../../collision/compute-horizontal-move';
import type { AxisMove } from '../../collision/types/axis-move';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../consts';
import { computeBlockedVelocityX } from './compute-blocked-velocity-x';
import type { PlayerStepFall } from './types/player-step-fall';
import type { PlayerStepHorizontalMove } from './types/player-step-horizontal-move';

const computePlayerHorizontalMove = ({
  level,
  player,
  deltaSeconds,
  velocityX,
}: PlayerStepFall): AxisMove =>
  computeHorizontalMove(
    level,
    player.position.x,
    player.position.y,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    velocityX * deltaSeconds,
  );

const createPlayerStepHorizontalMove = (
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

export const computePlayerStepHorizontalMove = (
  fall: PlayerStepFall,
): PlayerStepHorizontalMove =>
  createPlayerStepHorizontalMove(fall, computePlayerHorizontalMove(fall));
