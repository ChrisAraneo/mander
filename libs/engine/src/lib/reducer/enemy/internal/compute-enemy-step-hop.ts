import { toFacing } from '../../internal/to-facing';
import { computeEnemyHop } from './compute-enemy-hop';
import type { EnemyStepDelta } from './types/enemy-step-delta';
import type { EnemyStepIntent } from './types/enemy-step-intent';

export const computeEnemyStepHop = ({
  level,
  enemy,
  player,
  deltaSeconds,
}: EnemyStepDelta): EnemyStepIntent => ({
  level,
  enemy,
  deltaSeconds,
  facing: toFacing(enemy.statuses.isFacingRight),
  ...computeEnemyHop(
    enemy.statuses.isGrounded,
    enemy.velocity.y.current,
    enemy,
    player,
  ),
});
