import {
  type Enemy,
  GRAVITY,
  MAX_TICK_SECONDS,
  TERMINAL_VELOCITY,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createPatrols } from './create-patrols';
import { patchDyingEnemy } from './patch-dying-enemy';

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
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '..e..', '.....', '.....', '#####']);

const BASE_ENEMY = createPatrols(LEVEL)[0];

const createDyingEnemy = (top: number, fallSpeed: number): Enemy => ({
  ...BASE_ENEMY,
  position: { x: 40, y: top },
  velocity: {
    ...BASE_ENEMY.velocity,
    y: { ...BASE_ENEMY.velocity.y, current: fallSpeed },
  },
  timers: { death: 0.1, reload: 0 },
});

describe('patchDyingEnemy', () => {
  it('should speed up the fall by gravity when the dying enemy drops through the air', () => {
    const enemy = createDyingEnemy(20, 0);

    const patched = patchDyingEnemy(LEVEL, enemy, 0.02);

    expect(patched.velocity.y.current).toBeCloseTo(GRAVITY * 0.02, 6);
  });

  it('should move the dying enemy down by its new fall speed when it drops through the air', () => {
    const enemy = createDyingEnemy(20, 0);

    const patched = patchDyingEnemy(LEVEL, enemy, 0.02);

    expect(patched.position.x).toBe(40);
    expect(patched.position.y).toBeCloseTo(20.72, 6);
  });

  it('should hold the fall at terminal velocity when the dying enemy is already falling fast', () => {
    const enemy = createDyingEnemy(20, 1140);

    const patched = patchDyingEnemy(LEVEL, enemy, 0.02);

    expect(patched.velocity.y.current).toBe(TERMINAL_VELOCITY);
    expect(patched.position.y).toBeCloseTo(20 + TERMINAL_VELOCITY * 0.02, 6);
  });

  it('should put the dying enemy flush on top of the floor and stop its fall when it lands', () => {
    const enemy = createDyingEnemy(100, 500);

    const patched = patchDyingEnemy(LEVEL, enemy, 0.02);

    expect(patched.position.y).toBe(106);
    expect(patched.velocity.y.current).toBe(0);
  });

  it('should only move the dying enemy by one longest tick when the frame takes too long', () => {
    const enemy = createDyingEnemy(20, 0);

    const patched = patchDyingEnemy(LEVEL, enemy, 1);

    expect(patched.velocity.y.current).toBeCloseTo(
      GRAVITY * MAX_TICK_SECONDS,
      6,
    );
    expect(patched.position.y).toBeCloseTo(
      20 + GRAVITY * MAX_TICK_SECONDS * MAX_TICK_SECONDS,
      6,
    );
  });

  it('should keep the death clock and the sideways motion when the dying enemy falls', () => {
    const enemy = createDyingEnemy(20, 0);

    const patched = patchDyingEnemy(LEVEL, enemy, 0.02);

    expect(patched.timers).toBe(enemy.timers);
    expect(patched.velocity.x).toBe(enemy.velocity.x);
    expect(patched.statuses).toBe(enemy.statuses);
  });

  it('should leave the given enemy unchanged when the dying enemy falls', () => {
    const enemy = createDyingEnemy(20, 0);

    patchDyingEnemy(LEVEL, enemy, 0.02);

    expect(enemy).toEqual(createDyingEnemy(20, 0));
  });
});
