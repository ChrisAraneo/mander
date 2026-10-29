import {
  type Enemy,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeEnemyStepVerticalMove } from './compute-enemy-step-vertical-move';
import type { EnemyStepHorizontalMove } from './types/enemy-step-horizontal-move';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

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
  position: { x: 36, y: positionY },
  velocity: { x: { current: 78, max: 78 }, y: { current: 0, max: 430 } },
  timers: { death: null, reload: 0 },
  spawn: { x: 36, y: positionY },
  statuses: { isFacingRight: true, isGrounded: false },
});

const LEVEL = createLevel();

const AIRBORNE_ENEMY = createFallingEnemy(10);

const LANDING_ENEMY = createFallingEnemy(72);

const createHorizontalMoveStep = (
  enemy: Enemy,
  velocityY: number,
  isGrounded: boolean,
): EnemyStepHorizontalMove => ({
  level: LEVEL,
  enemy,
  deltaSeconds: 0.04,
  facing: 1,
  velocityY,
  isGrounded,
  nextX: 40,
});

const AIRBORNE_STEP = createHorizontalMoveStep(AIRBORNE_ENEMY, 100, true);

describe('computeEnemyStepVerticalMove', () => {
  it('should move the enemy down the whole way and leave it off the ground when it falls through open air', () => {
    const step = computeEnemyStepVerticalMove(AIRBORNE_STEP);

    expect(step.nextY).toBeCloseTo(10 + 100 * 0.04, 6);
    expect(step.nextY).toBeCloseTo(14, 6);
    expect(step.velocityY).toBe(100);
    expect(step.isGrounded).toBe(false);
  });

  it('should put the enemy on the floor and stop its fall when it falls onto a solid tile', () => {
    const step = computeEnemyStepVerticalMove(
      createHorizontalMoveStep(LANDING_ENEMY, 300, false),
    );

    expect(step.nextY).toBe(74);
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

    expect(step.facing).toBe(1);
  });

  it('should pass the next horizontal position on unchanged when it moves the enemy up or down', () => {
    const step = computeEnemyStepVerticalMove(AIRBORNE_STEP);

    expect(step.nextX).toBe(40);
  });
});
