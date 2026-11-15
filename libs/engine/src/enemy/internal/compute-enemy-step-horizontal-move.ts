import { computeEnemyWalk } from './compute-enemy-walk';
import type { EnemyStepHorizontalMove } from './types/enemy-step-horizontal-move';
import type { EnemyStepIntent } from './types/enemy-step-intent';

export const computeEnemyStepHorizontalMove = ({
  level,
  enemy,
  deltaSeconds,
  facing,
  velocityY,
  isGrounded,
}: EnemyStepIntent): EnemyStepHorizontalMove => ({
  level,
  enemy,
  deltaSeconds,
  velocityY,
  isGrounded,
  ...computeEnemyWalk(level, enemy, facing, deltaSeconds),
});
