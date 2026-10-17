import type { Player } from '@mander/model';
import type { PlayerStepVerticalMove } from './types/player-step-vertical-move';

export const patchPlayerStep = ({
  player,
  isFacingRight,
  nextX,
  blockedVelocityX,
  nextY,
  velocityY,
  isGrounded,
}: PlayerStepVerticalMove): Player => ({
  position: { x: nextX, y: nextY },
  velocity: {
    x: { current: blockedVelocityX, max: player.velocity.x.max },
    y: { current: velocityY, max: player.velocity.y.max },
  },
  hearts: player.hearts,
  timers: player.timers,
  statuses: {
    isFacingRight,
    isGrounded,
    isJumpQueued: false,
  },
});
