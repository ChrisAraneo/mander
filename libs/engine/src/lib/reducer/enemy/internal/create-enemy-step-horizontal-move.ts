import type { AxisMove } from '../../collision/types/axis-move';
import { computeBlockedFacing } from './compute-blocked-facing';
import type { EnemyStepHorizontalMove } from './types/enemy-step-horizontal-move';
import type { EnemyStepIntent } from './types/enemy-step-intent';

export const createEnemyStepHorizontalMove = (
  {
    level,
    enemy,
    deltaSeconds,
    facing,
    velocityY,
    isGrounded,
  }: EnemyStepIntent,
  { position, isBlocked }: AxisMove,
): EnemyStepHorizontalMove => ({
  level,
  enemy,
  deltaSeconds,
  facing: computeBlockedFacing(isBlocked, facing),
  velocityY,
  isGrounded,
  nextX: position,
});
