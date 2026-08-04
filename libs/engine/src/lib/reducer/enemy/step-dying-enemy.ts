import {
  type Enemy,
  GRAVITY,
  type Level,
  MAX_TICK_SECONDS,
  TERMINAL_VELOCITY,
} from '@mander/model';

import { moveVertical } from '../collision/move-vertical';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from './consts';

export const stepDyingEnemy = (
  level: Level,
  enemy: Enemy,
  elapsedSeconds: number,
): Enemy => {
  const deltaSeconds = Math.min(elapsedSeconds, MAX_TICK_SECONDS);
  const vy = Math.min(
    enemy.velocity.y.current + GRAVITY * deltaSeconds,
    TERMINAL_VELOCITY,
  );
  const vertical = moveVertical(
    level,
    enemy.position.x,
    enemy.position.y,
    ENEMY_WIDTH,
    ENEMY_HEIGHT,
    vy * deltaSeconds,
  );

  return {
    ...enemy,
    position: { ...enemy.position, y: vertical.position },
    velocity: {
      ...enemy.velocity,
      y: { ...enemy.velocity.y, current: vertical.isBlocked ? 0 : vy },
    },
  };
};
