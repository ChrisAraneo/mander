import { pipe } from 'remeda';
import { getPlayerMoveVelocity } from '../get-player-move-velocity';
import { computePlayerJump } from './compute-player-jump';
import { isFacingRightFor } from './is-facing-right-for';
import { toHorizontalDirection } from './to-horizontal-direction';
import type { PlayerStepDelta } from './types/player-step-delta';
import type { PlayerStepIntent } from './types/player-step-intent';

export const computePlayerStepIntent = ({
  level,
  player,
  input,
  deltaSeconds,
}: PlayerStepDelta): PlayerStepIntent =>
  pipe(
    input,
    toHorizontalDirection,
    (direction) => ({
      velocityX: direction * getPlayerMoveVelocity(player),
      isFacingRight: isFacingRightFor(direction, player.statuses.isFacingRight),
      jump: computePlayerJump(
        {
          velocityY: player.velocity.y.current,
          isGrounded: player.statuses.isGrounded,
        },
        input,
        player,
      ),
    }),
    ({ velocityX, isFacingRight, jump }): PlayerStepIntent => ({
      level,
      player,
      input,
      deltaSeconds,
      velocityX,
      isFacingRight,
      velocityY: jump.velocityY,
      isGrounded: jump.isGrounded,
    }),
  );
