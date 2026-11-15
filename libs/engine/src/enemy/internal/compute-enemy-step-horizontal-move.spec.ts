import {
  type Enemy,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeFacingStep } from '../../facing/compute-facing-step';
import { FACING_LEFT, FACING_RIGHT } from '../../facing/consts';
import { ENEMY_JUMP_VELOCITY, ENEMY_MOVE_SPEED } from '../consts';
import { computeEnemyStepHorizontalMove } from './compute-enemy-step-horizontal-move';
import type { EnemyStepIntent } from './types/enemy-step-intent';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['......', '......', '...#..', '######'];

const createLevel = (): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const ENEMY_TOP = 74;
const OPEN_LEFT = 40;
const BEFORE_WALL_LEFT = 72;
const TICK_SECONDS = 0.04;
const RISING_SPEED = 72;
const PRECISION = 6;
const OPEN_RIGHT_LEFT = 43.12;
const FLUSH_WITH_WALL_LEFT = 74;

const createWalkingEnemy = (positionX: number): Enemy => ({
  kind: 'HOPPING',
  position: { x: positionX, y: ENEMY_TOP },
  velocity: {
    x: { current: ENEMY_MOVE_SPEED, max: ENEMY_MOVE_SPEED },
    y: { current: 0, max: ENEMY_JUMP_VELOCITY },
  },
  timers: { death: null, reload: 0 },
  spawn: { x: positionX, y: ENEMY_TOP },
  statuses: { isFacingRight: true, isGrounded: true },
});

const LEVEL = createLevel();

const OPEN_ENEMY = createWalkingEnemy(OPEN_LEFT);

const WALLED_ENEMY = createWalkingEnemy(BEFORE_WALL_LEFT);

const createIntentStep = (enemy: Enemy): EnemyStepIntent => ({
  level: LEVEL,
  enemy,
  deltaSeconds: TICK_SECONDS,
  facing: FACING_RIGHT,
  velocityY: RISING_SPEED,
  isGrounded: true,
});

const OPEN_STEP = createIntentStep(OPEN_ENEMY);

describe('computeEnemyStepHorizontalMove', () => {
  it('should move the enemy the whole way and keep its facing when nothing is in the way', () => {
    const step = computeEnemyStepHorizontalMove(OPEN_STEP);

    expect(step.nextX).toBeCloseTo(
      OPEN_LEFT +
        computeFacingStep(FACING_RIGHT) * ENEMY_MOVE_SPEED * TICK_SECONDS,
      PRECISION,
    );
    expect(step.nextX).toBeCloseTo(OPEN_RIGHT_LEFT, PRECISION);
    expect(step.facing).toBe(FACING_RIGHT);
  });

  it('should stop the enemy flush against the wall and turn it round when a solid tile is in the way', () => {
    const step = computeEnemyStepHorizontalMove(createIntentStep(WALLED_ENEMY));

    expect(step.nextX).toBe(FLUSH_WITH_WALL_LEFT);
    expect(step.facing).toBe(FACING_LEFT);
  });

  it('should pass the level on unchanged when it moves the enemy sideways', () => {
    const step = computeEnemyStepHorizontalMove(OPEN_STEP);

    expect(step.level).toBe(LEVEL);
  });

  it('should pass the enemy on unchanged when it moves the enemy sideways', () => {
    const step = computeEnemyStepHorizontalMove(OPEN_STEP);

    expect(step.enemy).toBe(OPEN_ENEMY);
  });

  it('should pass the tick length on unchanged when it moves the enemy sideways', () => {
    const step = computeEnemyStepHorizontalMove(OPEN_STEP);

    expect(step.deltaSeconds).toBe(TICK_SECONDS);
  });

  it('should pass the vertical velocity on unchanged when it moves the enemy sideways', () => {
    const step = computeEnemyStepHorizontalMove(OPEN_STEP);

    expect(step.velocityY).toBe(RISING_SPEED);
  });

  it('should pass the grounded status on unchanged when it moves the enemy sideways', () => {
    const step = computeEnemyStepHorizontalMove(OPEN_STEP);

    expect(step.isGrounded).toBe(true);
  });
});
