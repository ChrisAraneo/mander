import type { Enemy } from '@mander/model';
import { computeFacingStep } from '../../facing/compute-facing-step';
import { computeBlockedFacing } from './compute-blocked-facing';
import type { FlyingEnemyDrift } from './types/flying-enemy-drift';

export const patchFlyingEnemyDrift = ({
  enemy,
  speed,
  facing,
  isClamped,
  vertical,
}: FlyingEnemyDrift): Enemy => ({
  ...enemy,
  position: { ...enemy.position, y: vertical.position },
  velocity: {
    ...enemy.velocity,
    y: {
      ...enemy.velocity.y,
      current:
        computeFacingStep(
          computeBlockedFacing(vertical.isBlocked || isClamped, facing),
        ) * speed,
    },
  },
  statuses: { ...enemy.statuses, isGrounded: false },
});
