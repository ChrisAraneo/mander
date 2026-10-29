import {
  type Enemy,
  GRAVITY,
  type Level,
  TERMINAL_VELOCITY,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeEnemyStepFall } from './compute-enemy-step-fall';
import type { EnemyStepIntent } from './types/enemy-step-intent';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['....', '....', '####'];

const createLevel = (): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const createFallingEnemy = (): Enemy => ({
  kind: 'HOPPING',
  position: { x: 40, y: 10 },
  velocity: { x: { current: 78, max: 78 }, y: { current: 100, max: 430 } },
  timers: { death: null, reload: 0 },
  spawn: { x: 40, y: 10 },
  statuses: { isFacingRight: false, isGrounded: false },
});

const LEVEL = createLevel();

const ENEMY = createFallingEnemy();

const createIntentStep = (
  velocityY: number,
  deltaSeconds: number,
): EnemyStepIntent => ({
  level: LEVEL,
  enemy: ENEMY,
  deltaSeconds,
  facing: -1,
  velocityY,
  isGrounded: false,
});

const SLOW_STEP = createIntentStep(100, 0.02);

describe('computeEnemyStepFall', () => {
  it('should speed the fall up by gravity over the tick when the enemy falls slowly', () => {
    const step = computeEnemyStepFall(SLOW_STEP);

    expect(step.velocityY).toBeCloseTo(100 + GRAVITY * 0.02, 6);
    expect(step.velocityY).toBeCloseTo(136, 6);
  });

  it('should hold the fall at terminal velocity when gravity would push it past that speed', () => {
    const step = computeEnemyStepFall(createIntentStep(1140, 0.04));

    expect(step.velocityY).toBe(TERMINAL_VELOCITY);
  });

  it('should pass the level on unchanged when it applies gravity', () => {
    const step = computeEnemyStepFall(SLOW_STEP);

    expect(step.level).toBe(LEVEL);
  });

  it('should pass the enemy on unchanged when it applies gravity', () => {
    const step = computeEnemyStepFall(SLOW_STEP);

    expect(step.enemy).toBe(ENEMY);
  });

  it('should pass the tick length on unchanged when it applies gravity', () => {
    const step = computeEnemyStepFall(SLOW_STEP);

    expect(step.deltaSeconds).toBe(0.02);
  });

  it('should pass the facing on unchanged when it applies gravity', () => {
    const step = computeEnemyStepFall(SLOW_STEP);

    expect(step.facing).toBe(-1);
  });

  it('should pass the grounded status on unchanged when it applies gravity', () => {
    const step = computeEnemyStepFall(SLOW_STEP);

    expect(step.isGrounded).toBe(false);
  });
});
