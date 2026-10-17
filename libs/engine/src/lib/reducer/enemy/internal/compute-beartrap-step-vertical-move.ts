import { chain } from '@mander/utils';
import { computeLanding } from '../../collision/compute-landing';
import { computeVerticalMove } from '../../collision/compute-vertical-move';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';
import type { BeartrapStepIntent } from './types/beartrap-step-intent';
import type { BeartrapStepVerticalMove } from './types/beartrap-step-vertical-move';

export const computeBeartrapStepVerticalMove = ({
  level,
  trap,
  deltaSeconds,
  velocityY,
  isGrounded,
}: BeartrapStepIntent): BeartrapStepVerticalMove =>
  chain(
    computeVerticalMove(
      level,
      trap.position.x,
      trap.position.y,
      ENEMY_WIDTH,
      ENEMY_HEIGHT,
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
    .thru(({ nextY, landing }): BeartrapStepVerticalMove => ({
      level,
      trap,
      velocityY: landing.velocityY,
      isGrounded: landing.isGrounded,
      nextY,
    }))
    .value();
