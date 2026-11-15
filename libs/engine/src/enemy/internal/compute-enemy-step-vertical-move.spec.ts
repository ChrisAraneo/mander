import {
  type Enemy,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FACING_RIGHT } from '../../facing/consts';
import { ENEMY_JUMP_VELOCITY, ENEMY_MOVE_SPEED } from '../consts';
import { computeEnemyStepVerticalMove } from './compute-enemy-step-vertical-move';
import type { EnemyStepHorizontalMove } from './types/enemy-step-horizontal-move';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ENEMY_LEFT = 36;
const AIRBORNE_TOP = 10;
const BEFORE_FLOOR_TOP = 72;
const FLOOR_TOP = 74;
const FALLEN_TOP = 14;
const NEXT_LEFT = 40;
const TICK_SECONDS = 0.04;
const SLOW_FALL_SPEED = 100;
const FAST_FALL_SPEED = 300;
const PRECISION = 6;

const ROWS = ['......', '......', '......', '######'];

const createLevel = (): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const createFallingEnemy = (positionY: number): Enemy => ({
  kind: 'HOPPING',
  position: { x: ENEMY_LEFT, y: positionY },
  velocity: {
    x: { current: ENEMY_MOVE_SPEED, max: ENEMY_MOVE_SPEED },
    y: { current: 0, max: ENEMY_JUMP_VELOCITY },
  },
  timers: { death: null, reload: 0 },
  spawn: { x: ENEMY_LEFT, y: positionY },
  statuses: { isFacingRight: true, isGrounded: false },
});

const LEVEL = createLevel();

const AIRBORNE_ENEMY = createFallingEnemy(AIRBORNE_TOP);

const LANDING_ENEMY = createFallingEnemy(BEFORE_FLOOR_TOP);

const createHorizontalMoveStep = (
  enemy: Enemy,
  velocityY: number,
  isGrounded: boolean,
): EnemyStepHorizontalMove => ({
  level: LEVEL,
  enemy,
  deltaSeconds: TICK_SECONDS,
  facing: FACING_RIGHT,
  velocityY,
  isGrounded,
  nextX: NEXT_LEFT,
});

const AIRBORNE_STEP = createHorizontalMoveStep(
  AIRBORNE_ENEMY,
  SLOW_FALL_SPEED,
  true,
);

describe('computeEnemyStepVerticalMove', () => {
  it('should move the enemy down the whole way and leave it off the ground when it falls through open air', () => {
    const step = computeEnemyStepVerticalMove(AIRBORNE_STEP);

    expect(step.nextY).toBeCloseTo(
      AIRBORNE_TOP + SLOW_FALL_SPEED * TICK_SECONDS,
      PRECISION,
    );
    expect(step.nextY).toBeCloseTo(FALLEN_TOP, PRECISION);
    expect(step.velocityY).toBe(SLOW_FALL_SPEED);
    expect(step.isGrounded).toBe(false);
  });

  it('should put the enemy on the floor and stop its fall when it falls onto a solid tile', () => {
    const step = computeEnemyStepVerticalMove(
      createHorizontalMoveStep(LANDING_ENEMY, FAST_FALL_SPEED, false),
    );

    expect(step.nextY).toBe(FLOOR_TOP);
    expect(step.velocityY).toBe(0);
    expect(step.isGrounded).toBe(true);
  });

  it('should pass the level on unchanged when it moves the enemy up or down', () => {
    const step = computeEnemyStepVerticalMove(AIRBORNE_STEP);

    expect(step.level).toBe(LEVEL);
  });

  it('should pass the enemy on unchanged when it moves the enemy up or down', () => {
    const step = computeEnemyStepVerticalMove(AIRBORNE_STEP);

    expect(step.enemy).toBe(AIRBORNE_ENEMY);
  });

  it('should pass the facing on unchanged when it moves the enemy up or down', () => {
    const step = computeEnemyStepVerticalMove(AIRBORNE_STEP);

    expect(step.facing).toBe(FACING_RIGHT);
  });

  it('should pass the next horizontal position on unchanged when it moves the enemy up or down', () => {
    const step = computeEnemyStepVerticalMove(AIRBORNE_STEP);

    expect(step.nextX).toBe(NEXT_LEFT);
  });
});
