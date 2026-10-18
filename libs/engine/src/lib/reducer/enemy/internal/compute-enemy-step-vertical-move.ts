import { chain } from '@mander/model';
import { computeLanding } from '../../collision/compute-landing';
import { computeVerticalMove } from '../../collision/compute-vertical-move';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';
import type { EnemyStepHorizontalMove } from './types/enemy-step-horizontal-move';
import type { EnemyStepVerticalMove } from './types/enemy-step-vertical-move';

export const computeEnemyStepVerticalMove = ({
  level,
  enemy,
  deltaSeconds,
  facing,
  velocityY,
  isGrounded,
  nextX,
}: EnemyStepHorizontalMove): EnemyStepVerticalMove =>
  chain(
    computeVerticalMove(
      level,
      nextX,
      enemy.position.y,
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
    .thru(({ nextY, landing }): EnemyStepVerticalMove => ({
      level,
      enemy,
      facing,
      velocityY: landing.velocityY,
      isGrounded: landing.isGrounded,
      nextX,
      nextY,
    }))
    .value();
