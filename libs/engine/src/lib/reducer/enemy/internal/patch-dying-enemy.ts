import {
  type Enemy,
  GRAVITY,
  type Level,
  MAX_TICK_SECONDS,
  TERMINAL_VELOCITY,
} from '@mander/model';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { computeVerticalMove } from '../../collision/compute-vertical-move';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';

export const patchDyingEnemy = (
  level: Level,
  enemy: Enemy,
  elapsedSeconds: number,
): Enemy =>
  pipe(
    Math.min(elapsedSeconds, MAX_TICK_SECONDS),
    (deltaSeconds) => ({
      deltaSeconds,
      velocityY: Math.min(
        enemy.velocity.y.current + GRAVITY * deltaSeconds,
        TERMINAL_VELOCITY,
      ),
    }),
    ({ deltaSeconds, velocityY }) => ({
      velocityY,
      vertical: computeVerticalMove(
        level,
        enemy.position.x,
        enemy.position.y,
        ENEMY_WIDTH,
        ENEMY_HEIGHT,
        velocityY * deltaSeconds,
      ),
    }),
    ({ velocityY, vertical }): Enemy => ({
      ...enemy,
      position: { ...enemy.position, y: vertical.position },
      velocity: {
        ...enemy.velocity,
        y: {
          ...enemy.velocity.y,
          current: match(vertical.isBlocked)
            .with(true, () => 0)
            .otherwise(() => velocityY),
        },
      },
    }),
  );
