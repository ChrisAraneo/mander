import { type Enemy, TILE_SIZE } from '@mander/model';
import { match } from 'ts-pattern';
import { ENEMY_PIT_DEPTH_TILES } from './consts';
import { finishEnemyDeath } from './finish-enemy-death';
import type { BeartrapStepVerticalMove } from './types/beartrap-step-vertical-move';

export const patchBeartrapStep = ({
  level,
  trap,
  velocityY,
  isGrounded,
  nextY,
}: BeartrapStepVerticalMove): Enemy =>
  match(nextY > (level.height + ENEMY_PIT_DEPTH_TILES) * TILE_SIZE)
    .with(true, (): Enemy => finishEnemyDeath(trap))
    .otherwise((): Enemy => ({
      ...trap,
      position: { ...trap.position, y: nextY },
      velocity: {
        x: { ...trap.velocity.x, current: 0 },
        y: { ...trap.velocity.y, current: velocityY },
      },
      statuses: { ...trap.statuses, isGrounded },
    }));
