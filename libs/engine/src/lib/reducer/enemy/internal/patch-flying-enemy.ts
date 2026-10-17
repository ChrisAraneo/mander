import { type Enemy, type Level, MAX_TICK_SECONDS } from '@mander/model';
import { chain } from '@mander/utils';
import { clamp } from 'lodash-es';
import { match } from 'ts-pattern';
import { computeVerticalMove } from '../../collision/compute-vertical-move';
import { FACING_LEFT, FACING_RIGHT } from '../../consts';
import type { Facing } from '../../types/facing';
import { ENEMY_HEIGHT, ENEMY_WIDTH, FLYING_ENEMY_RANGE } from '../consts';
import { computeBlockedFacing } from './compute-blocked-facing';

export const patchFlyingEnemy = (
  level: Level,
  enemy: Enemy,
  elapsedSeconds: number,
): Enemy =>
  chain({
    deltaSeconds: Math.min(elapsedSeconds, MAX_TICK_SECONDS),
    speed: enemy.velocity.y.max,
    facing: match(enemy.velocity.y.current < 0)
      .with(true, (): Facing => FACING_LEFT)
      .otherwise((): Facing => FACING_RIGHT),
  })
    .thru(({ deltaSeconds, speed, facing }) => ({
      speed,
      facing,
      rawNextY: enemy.position.y + facing * speed * deltaSeconds,
    }))
    .thru(({ speed, facing, rawNextY }) => ({
      speed,
      facing,
      rawNextY,
      clampedNextY: clamp(
        rawNextY,
        enemy.spawn.y - FLYING_ENEMY_RANGE,
        enemy.spawn.y + FLYING_ENEMY_RANGE,
      ),
    }))
    .thru(({ speed, facing, rawNextY, clampedNextY }) => ({
      speed,
      facing,
      isClamped: clampedNextY !== rawNextY,
      vertical: computeVerticalMove(
        level,
        enemy.position.x,
        enemy.position.y,
        ENEMY_WIDTH,
        ENEMY_HEIGHT,
        clampedNextY - enemy.position.y,
      ),
    }))
    .thru(({ speed, facing, isClamped, vertical }): Enemy => ({
      ...enemy,
      position: { ...enemy.position, y: vertical.position },
      velocity: {
        ...enemy.velocity,
        y: {
          ...enemy.velocity.y,
          current:
            computeBlockedFacing(vertical.isBlocked || isClamped, facing) *
            speed,
        },
      },
      statuses: { ...enemy.statuses, isGrounded: false },
    }))
    .value();
