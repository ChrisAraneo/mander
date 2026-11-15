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

import { FACING_LEFT } from '../../facing/consts';
import { ENEMY_JUMP_VELOCITY, ENEMY_MOVE_SPEED } from '../consts';
import { computeEnemyStepFall } from './compute-enemy-step-fall';
import type { EnemyStepIntent } from './types/enemy-step-intent';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const SLOW_FALL_SPEED = 100;
const PAST_TERMINAL_FALL_SPEED = 1140;
const SPED_UP_FALL_SPEED = 136;
const TICK_SECONDS = 0.02;
const LONG_TICK_SECONDS = 0.04;
const PRECISION = 6;

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
  velocity: {
    x: { current: ENEMY_MOVE_SPEED, max: ENEMY_MOVE_SPEED },
    y: { current: SLOW_FALL_SPEED, max: ENEMY_JUMP_VELOCITY },
  },
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
  facing: FACING_LEFT,
  velocityY,
  isGrounded: false,
});

const SLOW_STEP = createIntentStep(SLOW_FALL_SPEED, TICK_SECONDS);

describe('computeEnemyStepFall', () => {
  it('should speed the fall up by gravity over the tick when the enemy falls slowly', () => {
    const step = computeEnemyStepFall(SLOW_STEP);

    expect(step.velocityY).toBeCloseTo(
      SLOW_FALL_SPEED + GRAVITY * TICK_SECONDS,
      PRECISION,
    );
    expect(step.velocityY).toBeCloseTo(SPED_UP_FALL_SPEED, PRECISION);
  });

  it('should hold the fall at terminal velocity when gravity would push it past that speed', () => {
    const step = computeEnemyStepFall(
      createIntentStep(PAST_TERMINAL_FALL_SPEED, LONG_TICK_SECONDS),
    );

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

    expect(step.deltaSeconds).toBe(TICK_SECONDS);
  });

  it('should pass the facing on unchanged when it applies gravity', () => {
    const step = computeEnemyStepFall(SLOW_STEP);

    expect(step.facing).toBe(FACING_LEFT);
  });

  it('should pass the grounded status on unchanged when it applies gravity', () => {
    const step = computeEnemyStepFall(SLOW_STEP);

    expect(step.isGrounded).toBe(false);
  });
});
