import { type Enemy, TILE_SIZE } from '@mander/model';
import { match } from 'ts-pattern';
import { computeFacingStep } from '../../facing/compute-facing-step';
import { FACING_RIGHT } from '../../facing/consts';
import { computeEnemyWalkSpeed } from './compute-enemy-walk-speed';
import { ENEMY_PIT_DEPTH_TILES } from './consts';
import { finishEnemyDeath } from './finish-enemy-death';
import type { EnemyStepVerticalMove } from './types/enemy-step-vertical-move';

export const patchEnemyStep = ({
  level,
  enemy,
  facing,
  velocityY,
  isGrounded,
  nextX,
  nextY,
}: EnemyStepVerticalMove): Enemy =>
  match(nextY > (level.height + ENEMY_PIT_DEPTH_TILES) * TILE_SIZE)
    .with(true, (): Enemy => finishEnemyDeath(enemy))
    .otherwise((): Enemy => ({
      kind: enemy.kind,
      position: { x: nextX, y: nextY },
      velocity: {
        x: {
          current:
            computeFacingStep(facing) * computeEnemyWalkSpeed(level, enemy),
          max: enemy.velocity.x.max,
        },
        y: { current: velocityY, max: enemy.velocity.y.max },
      },
      timers: enemy.timers,
      spawn: enemy.spawn,
      statuses: {
        isFacingRight: facing === FACING_RIGHT,
        isGrounded,
      },
    }));
