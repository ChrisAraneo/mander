import { GRAVITY, TERMINAL_VELOCITY } from '@mander/model';
import type { EnemyStepIntent } from './types/enemy-step-intent';

export const computeEnemyStepFall = ({
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
  facing,
  velocityY: Math.min(velocityY + GRAVITY * deltaSeconds, TERMINAL_VELOCITY),
  isGrounded,
});
