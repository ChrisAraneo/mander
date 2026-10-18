import { GRAVITY, TERMINAL_VELOCITY } from '@mander/model';
import type { BeartrapStepIntent } from './types/beartrap-step-intent';

export const computeBeartrapStepFall = ({
  level,
  trap,
  deltaSeconds,
  velocityY,
  isGrounded,
}: BeartrapStepIntent): BeartrapStepIntent => ({
  level,
  trap,
  deltaSeconds,
  velocityY: Math.min(velocityY + GRAVITY * deltaSeconds, TERMINAL_VELOCITY),
  isGrounded,
});
