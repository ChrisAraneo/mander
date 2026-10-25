import { computeHorizontalMove } from '../../collision/compute-horizontal-move';
import type { AxisMove } from '../../collision/types/axis-move';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';
import { computeBlockedFacing } from './compute-blocked-facing';
import type { EnemyStepHorizontalMove } from './types/enemy-step-horizontal-move';
import type { EnemyStepIntent } from './types/enemy-step-intent';

const computeEnemyHorizontalMove = ({
  level,
  enemy,
  deltaSeconds,
  facing,
}: EnemyStepIntent): AxisMove =>
  computeHorizontalMove(
    level,
    enemy.position.x,
    enemy.position.y,
    ENEMY_WIDTH,
    ENEMY_HEIGHT,
    facing * enemy.velocity.x.max * deltaSeconds,
  );

const createEnemyStepHorizontalMove = (
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

export const computeEnemyStepHorizontalMove = (
  intent: EnemyStepIntent,
): EnemyStepHorizontalMove =>
  createEnemyStepHorizontalMove(intent, computeEnemyHorizontalMove(intent));
