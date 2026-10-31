import {
  type Enemy,
  MAX_TICK_SECONDS,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { FLYING_ENEMY_MOVE_SPEED, FLYING_ENEMY_RANGE } from '../consts';
import { createPatrols } from './create-patrols';
import { patchFlyingEnemy } from './patch-flying-enemy';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const OPEN_LEVEL = createLevel([
  '.....',
  '..e..',
  '.....',
  '.....',
  '.....',
  '.....',
]);

const FLOORED_LEVEL = createLevel([
  '.....',
  '..e..',
  '.....',
  '.....',
  '#####',
]);

const BASE_ENEMY = createPatrols(OPEN_LEVEL)[0];

const SPAWN_TOP = 100;

const createFlyingEnemy = (top: number, verticalSpeed: number): Enemy => ({
  ...BASE_ENEMY,
  position: { x: 40, y: top },
  spawn: { x: 40, y: SPAWN_TOP },
  velocity: {
    ...BASE_ENEMY.velocity,
    y: { ...BASE_ENEMY.velocity.y, current: verticalSpeed },
  },
  statuses: { isFacingRight: true, isGrounded: true },
});

describe('patchFlyingEnemy', () => {
  it('should move the flying enemy down at its flying speed when it is heading down', () => {
    const enemy = createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED);

    const patched = patchFlyingEnemy(OPEN_LEVEL, enemy, 0.02);

    expect(patched.position.y).toBeCloseTo(
      SPAWN_TOP + FLYING_ENEMY_MOVE_SPEED * 0.02,
      6,
    );
    expect(patched.velocity.y.current).toBe(FLYING_ENEMY_MOVE_SPEED);
  });

  it('should move the flying enemy up at its flying speed when it is heading up', () => {
    const enemy = createFlyingEnemy(SPAWN_TOP, -FLYING_ENEMY_MOVE_SPEED);

    const patched = patchFlyingEnemy(OPEN_LEVEL, enemy, 0.02);

    expect(patched.position.y).toBeCloseTo(
      SPAWN_TOP - FLYING_ENEMY_MOVE_SPEED * 0.02,
      6,
    );
    expect(patched.velocity.y.current).toBe(-FLYING_ENEMY_MOVE_SPEED);
  });

  it('should send the flying enemy down at its flying speed when it is hovering still', () => {
    const enemy = createFlyingEnemy(SPAWN_TOP, 0);

    const patched = patchFlyingEnemy(OPEN_LEVEL, enemy, 0.02);

    expect(patched.position.y).toBeCloseTo(
      SPAWN_TOP + FLYING_ENEMY_MOVE_SPEED * 0.02,
      6,
    );
    expect(patched.velocity.y.current).toBe(FLYING_ENEMY_MOVE_SPEED);
  });

  it('should only move the flying enemy by one longest tick when the frame takes too long', () => {
    const enemy = createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED);

    const patched = patchFlyingEnemy(OPEN_LEVEL, enemy, 1);

    expect(patched.position.y).toBeCloseTo(
      SPAWN_TOP + FLYING_ENEMY_MOVE_SPEED * MAX_TICK_SECONDS,
      6,
    );
  });

  it('should stop the flying enemy at the bottom of its range and turn it up when it flies past', () => {
    const enemy = createFlyingEnemy(131, FLYING_ENEMY_MOVE_SPEED);

    const patched = patchFlyingEnemy(OPEN_LEVEL, enemy, MAX_TICK_SECONDS);

    expect(patched.position.y).toBe(SPAWN_TOP + FLYING_ENEMY_RANGE);
    expect(patched.velocity.y.current).toBe(-FLYING_ENEMY_MOVE_SPEED);
  });

  it('should stop the flying enemy at the top of its range and turn it down when it flies past', () => {
    const enemy = createFlyingEnemy(69, -FLYING_ENEMY_MOVE_SPEED);

    const patched = patchFlyingEnemy(OPEN_LEVEL, enemy, MAX_TICK_SECONDS);

    expect(patched.position.y).toBe(SPAWN_TOP - FLYING_ENEMY_RANGE);
    expect(patched.velocity.y.current).toBe(FLYING_ENEMY_MOVE_SPEED);
  });

  it('should stop the flying enemy against the floor and turn it up when it flies into it', () => {
    const enemy = createFlyingEnemy(105, FLYING_ENEMY_MOVE_SPEED);

    const patched = patchFlyingEnemy(FLOORED_LEVEL, enemy, MAX_TICK_SECONDS);

    expect(patched.position.y).toBe(106);
    expect(patched.velocity.y.current).toBe(-FLYING_ENEMY_MOVE_SPEED);
  });

  it('should keep the flying enemy off the ground when it was marked as grounded', () => {
    const enemy = createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED);

    const patched = patchFlyingEnemy(OPEN_LEVEL, enemy, 0.02);

    expect(patched.statuses).toEqual({
      isFacingRight: true,
      isGrounded: false,
    });
  });

  it('should keep the sideways place and motion when the flying enemy moves', () => {
    const enemy = createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED);

    const patched = patchFlyingEnemy(OPEN_LEVEL, enemy, 0.02);

    expect(patched.position.x).toBe(40);
    expect(patched.velocity.x).toBe(enemy.velocity.x);
  });

  it('should leave the given enemy unchanged when the flying enemy moves', () => {
    const enemy = createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED);

    patchFlyingEnemy(OPEN_LEVEL, enemy, 0.02);

    expect(enemy).toEqual(
      createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
    );
  });
});
