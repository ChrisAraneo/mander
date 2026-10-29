import {
  type Enemy,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { ENEMY_DEATH_SECONDS } from '../consts';
import { ENEMY_PIT_DEPTH_TILES } from './consts';
import { patchEnemyStep } from './patch-enemy-step';
import type { EnemyStepVerticalMove } from './types/enemy-step-vertical-move';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['......', '......', '......', '######'];

const createLevel = (): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const createWalkingEnemy = (): Enemy => ({
  kind: 'HOPPING',
  position: { x: 36, y: 70 },
  velocity: { x: { current: 78, max: 78 }, y: { current: 50, max: 430 } },
  timers: { death: null, reload: 0 },
  spawn: { x: 20, y: 74 },
  statuses: { isFacingRight: true, isGrounded: false },
});

const LEVEL = createLevel();

const PIT_BOTTOM = (size(ROWS) + ENEMY_PIT_DEPTH_TILES) * TILE_SIZE;

const createVerticalMoveStep = (
  enemy: Enemy,
  nextY: number,
): EnemyStepVerticalMove => ({
  level: LEVEL,
  enemy,
  facing: -1,
  velocityY: 0,
  isGrounded: true,
  nextX: 40,
  nextY,
});

const ENEMY = createWalkingEnemy();

const STEP = createVerticalMoveStep(ENEMY, 74);

describe('patchEnemyStep', () => {
  it('should place the enemy at the next position with its new speeds and facing when it finishes the step', () => {
    const patched = patchEnemyStep(STEP);

    expect(patched.position).toEqual({ x: 40, y: 74 });
    expect(patched.velocity).toEqual({
      x: { current: -78, max: 78 },
      y: { current: 0, max: 430 },
    });
    expect(patched.statuses).toEqual({
      isFacingRight: false,
      isGrounded: true,
    });
  });

  it('should keep the same timers and spawn point when it finishes the step', () => {
    const patched = patchEnemyStep(STEP);

    expect(patched.timers).toBe(ENEMY.timers);
    expect(patched.spawn).toBe(ENEMY.spawn);
  });

  it('should start the death of the enemy and stop it when it has fallen below the bottom of the pit', () => {
    const patched = patchEnemyStep(
      createVerticalMoveStep(ENEMY, PIT_BOTTOM + 1),
    );

    expect(PIT_BOTTOM).toBe(192);
    expect(patched.timers.death).toBe(ENEMY_DEATH_SECONDS);
    expect(patched.velocity.x.current).toBe(0);
    expect(patched.velocity.y.current).toBe(0);
    expect(patched.position).toEqual({ x: 36, y: 70 });
  });

  it('should leave the given enemy unchanged when it finishes the step', () => {
    const enemy = createWalkingEnemy();

    patchEnemyStep(createVerticalMoveStep(enemy, 74));

    expect(enemy).toEqual(createWalkingEnemy());
  });
});
