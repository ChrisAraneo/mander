import { computeFacingStep } from '../../facing/compute-facing-step';
import { createFlyingEnemyTarget } from './create-flying-enemy-target';
import type { FlyingEnemyFlight } from './types/flying-enemy-flight';
import type { FlyingEnemyTarget } from './types/flying-enemy-target';

export const computeFlyingEnemyTarget = ({
  level,
  enemy,
  deltaSeconds,
  speed,
  facing,
}: FlyingEnemyFlight): FlyingEnemyTarget =>
  createFlyingEnemyTarget(
    { level, enemy, speed, facing },
    enemy.position.y + computeFacingStep(facing) * speed * deltaSeconds,
  );
