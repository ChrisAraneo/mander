import {
  type Enemy,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FACING_LEFT, FACING_RIGHT } from '../../facing/consts';
import { ENEMY_JUMP_VELOCITY, ENEMY_MOVE_SPEED } from '../consts';
import { computeEnemyStepTurn } from './compute-enemy-step-turn';
import type { EnemyStepIntent } from './types/enemy-step-intent';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ENEMY_LEFT = 80;
const ENEMY_TOP = 74;
const TICK_SECONDS = 0.02;
const RISING_SPEED = 36;

const createLevel = (rows: string[]): Level => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const OPEN_LEVEL = createLevel(['......', '......', '......', '######']);

const WALL_LEVEL = createLevel(['......', '......', '...#..', '######']);

const createWalkingEnemy = (): Enemy => ({
  kind: 'HOPPING',
  position: { x: ENEMY_LEFT, y: ENEMY_TOP },
  velocity: {
    x: { current: ENEMY_MOVE_SPEED, max: ENEMY_MOVE_SPEED },
    y: { current: 0, max: ENEMY_JUMP_VELOCITY },
  },
  timers: { death: null, reload: 0 },
  spawn: { x: ENEMY_LEFT, y: ENEMY_TOP },
  statuses: { isFacingRight: true, isGrounded: true },
});

const ENEMY = createWalkingEnemy();

const createIntentStep = (
  level: Level,
  isGrounded: boolean,
): EnemyStepIntent => ({
  level,
  enemy: ENEMY,
  deltaSeconds: TICK_SECONDS,
  facing: FACING_RIGHT,
  velocityY: RISING_SPEED,
  isGrounded,
});

const OPEN_STEP = createIntentStep(OPEN_LEVEL, true);

describe('computeEnemyStepTurn', () => {
  it('should turn the enemy round when it stands on the ground and a wall is ahead', () => {
    const step = computeEnemyStepTurn(createIntentStep(WALL_LEVEL, true));

    expect(step.facing).toBe(FACING_LEFT);
  });

  it('should keep the enemy facing the same way when the way ahead is clear', () => {
    const step = computeEnemyStepTurn(OPEN_STEP);

    expect(step.facing).toBe(FACING_RIGHT);
  });

  it('should keep the enemy facing the same way when it is in the air in front of a wall', () => {
    const step = computeEnemyStepTurn(createIntentStep(WALL_LEVEL, false));

    expect(step.facing).toBe(FACING_RIGHT);
  });

  it('should pass the level on unchanged when it decides on the turn', () => {
    const step = computeEnemyStepTurn(OPEN_STEP);

    expect(step.level).toBe(OPEN_LEVEL);
  });

  it('should pass the enemy on unchanged when it decides on the turn', () => {
    const step = computeEnemyStepTurn(OPEN_STEP);

    expect(step.enemy).toBe(ENEMY);
  });

  it('should pass the tick length on unchanged when it decides on the turn', () => {
    const step = computeEnemyStepTurn(OPEN_STEP);

    expect(step.deltaSeconds).toBe(TICK_SECONDS);
  });

  it('should pass the vertical velocity on unchanged when it decides on the turn', () => {
    const step = computeEnemyStepTurn(OPEN_STEP);

    expect(step.velocityY).toBe(RISING_SPEED);
  });

  it('should pass the grounded status on unchanged when it decides on the turn', () => {
    const step = computeEnemyStepTurn(OPEN_STEP);

    expect(step.isGrounded).toBe(true);
  });
});
