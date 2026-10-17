import { chain } from '@mander/utils';
import { computeHorizontalMove } from '../../collision/compute-horizontal-move';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../consts';
import { computeBlockedVelocityX } from './compute-blocked-velocity-x';
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
}: PlayerStepFall): PlayerStepHorizontalMove =>
  chain(
    computeHorizontalMove(
      level,
      player.position.x,
      player.position.y,
      PLAYER_WIDTH,
      PLAYER_HEIGHT,
      velocityX * deltaSeconds,
    ),
  )
    .thru((horizontal): PlayerStepHorizontalMove => ({
      level,
      player,
      deltaSeconds,
      isFacingRight,
      velocityY,
      isGrounded,
      nextX: horizontal.position,
      blockedVelocityX: computeBlockedVelocityX(
        horizontal.isBlocked,
        velocityX,
      ),
    }))
    .value();
