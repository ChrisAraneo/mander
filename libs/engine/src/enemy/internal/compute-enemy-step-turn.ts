import { computeEnemyTurn } from './compute-enemy-turn';
import type { EnemyStepIntent } from './types/enemy-step-intent';

export const computeEnemyStepTurn = ({
  level,
  enemy,
  deltaSeconds,
  facing,
  velocityY,
  isGrounded,
}: EnemyStepIntent): EnemyStepIntent => ({
  level,
  enemy,
  deltaSeconds,
  facing: computeEnemyTurn(
    level,
    enemy.position.x,
    enemy.position.y,
    facing,
    isGrounded,
  ),
  velocityY,
  isGrounded,
});
