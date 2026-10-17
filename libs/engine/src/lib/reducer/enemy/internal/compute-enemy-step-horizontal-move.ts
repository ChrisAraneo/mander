import { chain } from '@mander/utils';
import { computeHorizontalMove } from '../../collision/compute-horizontal-move';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';
import { computeBlockedFacing } from './compute-blocked-facing';
import type { EnemyStepHorizontalMove } from './types/enemy-step-horizontal-move';
import type { EnemyStepIntent } from './types/enemy-step-intent';

export const computeEnemyStepHorizontalMove = ({
  level,
  enemy,
  deltaSeconds,
  facing,
  velocityY,
  isGrounded,
}: EnemyStepIntent): EnemyStepHorizontalMove =>
  chain(
    computeHorizontalMove(
      level,
      enemy.position.x,
      enemy.position.y,
      ENEMY_WIDTH,
      ENEMY_HEIGHT,
      facing * enemy.velocity.x.max * deltaSeconds,
    ),
  )
    .thru((horizontal): EnemyStepHorizontalMove => ({
      level,
      enemy,
      deltaSeconds,
      facing: computeBlockedFacing(horizontal.isBlocked, facing),
      velocityY,
      isGrounded,
      nextX: horizontal.position,
    }))
    .value();
