import { chain } from '@mander/model';
import { toFacing } from '../../internal/to-facing';
import { computeEnemyHop } from './compute-enemy-hop';
import type { EnemyStepDelta } from './types/enemy-step-delta';
import type { EnemyStepIntent } from './types/enemy-step-intent';

export const computeEnemyStepHop = ({
  level,
  enemy,
  player,
  deltaSeconds,
}: EnemyStepDelta): EnemyStepIntent =>
  chain({
    facing: toFacing(enemy.statuses.isFacingRight),
    hop: computeEnemyHop(
      enemy.statuses.isGrounded,
      enemy.velocity.y.current,
      enemy,
      player,
    ),
  })
    .thru(({ facing, hop }): EnemyStepIntent => ({
      level,
      enemy,
      deltaSeconds,
      facing,
      velocityY: hop.velocityY,
      isGrounded: hop.isGrounded,
    }))
    .value();
