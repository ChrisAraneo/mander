import { GRAVITY, TERMINAL_VELOCITY } from '@mander/model';
import type { DyingEnemyDelta } from './types/dying-enemy-delta';
import type { DyingEnemyFall } from './types/dying-enemy-fall';

export const computeDyingEnemyFall = ({
  level,
  enemy,
  deltaSeconds,
}: DyingEnemyDelta): DyingEnemyFall => ({
  level,
  enemy,
  deltaSeconds,
  velocityY: Math.min(
    enemy.velocity.y.current + GRAVITY * deltaSeconds,
    TERMINAL_VELOCITY,
  ),
});
