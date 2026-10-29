import {
  type Enemy,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

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

const createWalkingEnemy = (positionX: number): Enemy => ({
  kind: 'HOPPING',
  position: { x: positionX, y: 74 },
  velocity: { x: { current: 78, max: 78 }, y: { current: 0, max: 430 } },
  timers: { death: null, reload: 0 },
  spawn: { x: positionX, y: 74 },
  statuses: { isFacingRight: true, isGrounded: true },
});

const LEVEL = createLevel();

const OPEN_ENEMY = createWalkingEnemy(40);

const WALLED_ENEMY = createWalkingEnemy(72);

const createIntentStep = (enemy: Enemy): EnemyStepIntent => ({
  level: LEVEL,
  enemy,
  deltaSeconds: 0.04,
  facing: 1,
  velocityY: 72,
  isGrounded: true,
});

const OPEN_STEP = createIntentStep(OPEN_ENEMY);

describe('computeEnemyStepHorizontalMove', () => {
  it('should move the enemy the whole way and keep its facing when nothing is in the way', () => {
    const step = computeEnemyStepHorizontalMove(OPEN_STEP);

    expect(step.nextX).toBeCloseTo(40 + 1 * 78 * 0.04, 6);
    expect(step.nextX).toBeCloseTo(43.12, 6);
    expect(step.facing).toBe(1);
  });

  it('should stop the enemy flush against the wall and turn it round when a solid tile is in the way', () => {
    const step = computeEnemyStepHorizontalMove(createIntentStep(WALLED_ENEMY));

    expect(step.nextX).toBe(74);
    expect(step.facing).toBe(-1);
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

    expect(step.deltaSeconds).toBe(0.04);
  });

  it('should pass the vertical velocity on unchanged when it moves the enemy sideways', () => {
    const step = computeEnemyStepHorizontalMove(OPEN_STEP);

    expect(step.velocityY).toBe(72);
  });

  it('should pass the grounded status on unchanged when it moves the enemy sideways', () => {
    const step = computeEnemyStepHorizontalMove(OPEN_STEP);

    expect(step.isGrounded).toBe(true);
  });
});
