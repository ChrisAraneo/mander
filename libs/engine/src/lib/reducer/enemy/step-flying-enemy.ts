import { type Enemy, type Level, MAX_TICK_SECONDS } from '@mander/model';
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

// A flying enemy ignores gravity while alive and never moves sideways — it
// only rises and falls, bouncing between one block above and one block
// below its own spawn point. velocity.y.current doubles as both its current
// speed and direction (negative = rising), the same way a ground enemy's
// velocity.x.current already encodes its patrol direction; velocity.y.max
// holds its (slower) vertical patrol speed, the same role velocity.x.max
// plays for a ground enemy's horizontal one. Once killed, advanceEnemy
// hands it off to stepDyingEnemy, where gravity takes over like any other
// enemy.
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
  const clampedNextY = Math.min(Math.max(rawNextY, upperBound), lowerBound);

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
