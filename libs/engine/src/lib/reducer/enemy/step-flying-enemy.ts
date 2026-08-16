import { type Enemy, type Level, MAX_TICK_SECONDS } from '@mander/model';
import { clamp } from 'lodash-es';
import { match } from 'ts-pattern';

import { moveVertical } from '../collision/move-vertical';
import { ENEMY_HEIGHT, ENEMY_WIDTH, FLYING_ENEMY_RANGE } from './consts';

const opposite = (facing: 1 | -1): 1 | -1 =>
  match(facing)
    .with(1, (): 1 | -1 => -1)
    .otherwise((): 1 | -1 => 1);

const turnAtBound = (isBlocked: boolean, facing: 1 | -1): 1 | -1 =>
  match(isBlocked)
    .with(true, () => opposite(facing))
    .otherwise(() => facing);

export const stepFlyingEnemy = (
  level: Level,
  enemy: Enemy,
  elapsedSeconds: number,
): Enemy => {
  const deltaSeconds = Math.min(elapsedSeconds, MAX_TICK_SECONDS);
  const speed = enemy.velocity.y.max;
  const facing: 1 | -1 = enemy.velocity.y.current < 0 ? -1 : 1;

  const upperBound = enemy.spawn.y - FLYING_ENEMY_RANGE;
  const lowerBound = enemy.spawn.y + FLYING_ENEMY_RANGE;
  const rawNextY = enemy.position.y + facing * speed * deltaSeconds;
  const clampedNextY = clamp(rawNextY, upperBound, lowerBound);

  const vertical = moveVertical(
    level,
    enemy.position.x,
    enemy.position.y,
    ENEMY_WIDTH,
    ENEMY_HEIGHT,
    clampedNextY - enemy.position.y,
  );
  const nextFacing = turnAtBound(
    vertical.isBlocked || clampedNextY !== rawNextY,
    facing,
  );

  return {
    ...enemy,
    position: { ...enemy.position, y: vertical.position },
    velocity: {
      ...enemy.velocity,
      y: { ...enemy.velocity.y, current: nextFacing * speed },
    },
    statuses: { ...enemy.statuses, isGrounded: false },
  };
};
