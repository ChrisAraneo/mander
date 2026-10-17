import { chain } from '@mander/utils';
import { computeLanding } from '../../collision/compute-landing';
import { computeVerticalMove } from '../../collision/compute-vertical-move';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../consts';
import type { PlayerStepHorizontalMove } from './types/player-step-horizontal-move';
import type { PlayerStepVerticalMove } from './types/player-step-vertical-move';

export const computePlayerStepVerticalMove = ({
  level,
  player,
  deltaSeconds,
  isFacingRight,
  velocityY,
  isGrounded,
  nextX,
  blockedVelocityX,
}: PlayerStepHorizontalMove): PlayerStepVerticalMove =>
  chain(
    computeVerticalMove(
      level,
      nextX,
      player.position.y,
      PLAYER_WIDTH,
      PLAYER_HEIGHT,
      velocityY * deltaSeconds,
    ),
  )
    .thru((vertical) => ({
      nextY: vertical.position,
      landing: computeLanding(
        vertical.isBlocked,
        velocityY > 0,
        isGrounded,
        velocityY,
      ),
    }))
    .thru(({ nextY, landing }): PlayerStepVerticalMove => ({
      player,
      isFacingRight,
      nextX,
      blockedVelocityX,
      nextY,
      velocityY: landing.velocityY,
      isGrounded: landing.isGrounded,
    }))
    .value();
