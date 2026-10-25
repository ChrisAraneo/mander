import { type Enemy, type Level, TILE_AIR } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createEnemyStepHorizontalMove } from './create-enemy-step-horizontal-move';
import type { EnemyStepIntent } from './types/enemy-step-intent';

const LEVEL: Level = {
  seed: 'SEED',
  width: 1,
  height: 1,
  tiles: [[TILE_AIR]],
  chestItems: [],
};

const ENEMY: Enemy = {
  kind: 'HOPPING',
  position: { x: 40, y: 74 },
  velocity: { x: { current: 78, max: 78 }, y: { current: 0, max: 430 } },
  timers: { death: null },
  spawn: { x: 40, y: 74 },
  statuses: { isFacingRight: true, isGrounded: true },
};

const INTENT: EnemyStepIntent = {
  level: LEVEL,
  enemy: ENEMY,
  deltaSeconds: 0.04,
  facing: 1,
  velocityY: 72,
  isGrounded: true,
};

const OPEN_MOVE = { position: 43, isBlocked: false };

describe('createEnemyStepHorizontalMove', () => {
  it('should give the new position as the next x when the move is made', () => {
    const step = createEnemyStepHorizontalMove(INTENT, OPEN_MOVE);

    expect(step.nextX).toBe(43);
  });

  it('should keep the facing when the move is not blocked', () => {
    const step = createEnemyStepHorizontalMove(INTENT, OPEN_MOVE);

    expect(step.facing).toBe(1);
  });

  it('should turn the enemy round when the move is blocked', () => {
    const step = createEnemyStepHorizontalMove(INTENT, {
      position: 40,
      isBlocked: true,
    });

    expect(step.facing).toBe(-1);
  });

  it('should pass the level on unchanged when the move is made', () => {
    const step = createEnemyStepHorizontalMove(INTENT, OPEN_MOVE);

    expect(step.level).toBe(LEVEL);
  });

  it('should pass the enemy on unchanged when the move is made', () => {
    const step = createEnemyStepHorizontalMove(INTENT, OPEN_MOVE);

    expect(step.enemy).toBe(ENEMY);
  });

  it('should pass the tick length on unchanged when the move is made', () => {
    const step = createEnemyStepHorizontalMove(INTENT, OPEN_MOVE);

    expect(step.deltaSeconds).toBe(0.04);
  });

  it('should pass the vertical velocity on unchanged when the move is made', () => {
    const step = createEnemyStepHorizontalMove(INTENT, OPEN_MOVE);

    expect(step.velocityY).toBe(72);
  });

  it('should pass the grounded status on unchanged when the move is made', () => {
    const step = createEnemyStepHorizontalMove(INTENT, OPEN_MOVE);

    expect(step.isGrounded).toBe(true);
  });
});
