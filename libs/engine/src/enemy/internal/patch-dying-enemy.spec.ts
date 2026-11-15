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

import type { GameLevel } from '../../state/types/game-level';
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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '..e..', '.....', '.....', '#####']);

const BASE_ENEMY = createPatrols(LEVEL)[0];

const ENEMY_LEFT = 40;
const AIRBORNE_TOP = 20;
const BEFORE_FLOOR_TOP = 100;
const ON_FLOOR_TOP = 106;
const FALLEN_TOP = 20.72;
const DYING_SECONDS = 0.1;
const NO_FALL_SPEED = 0;
const PAST_TERMINAL_FALL_SPEED = 1140;
const FAST_FALL_SPEED = 500;
const TICK_SECONDS = 0.02;
const LONG_TICK_SECONDS = 1;
const PRECISION = 6;

const createDyingEnemy = (top: number, velocityY: number): Enemy => ({
  ...BASE_ENEMY,
  position: { x: ENEMY_LEFT, y: top },
  velocity: {
    ...BASE_ENEMY.velocity,
    y: { ...BASE_ENEMY.velocity.y, current: velocityY },
  },
  timers: { death: DYING_SECONDS, reload: 0 },
});

describe('patchDyingEnemy', () => {
  it('should speed up the fall by gravity when the dying enemy drops through the air', () => {
    const enemy = createDyingEnemy(AIRBORNE_TOP, NO_FALL_SPEED);

    const patched = patchDyingEnemy(LEVEL, enemy, TICK_SECONDS);

    expect(patched.velocity.y.current).toBeCloseTo(
      GRAVITY * TICK_SECONDS,
      PRECISION,
    );
  });

  it('should move the dying enemy down by its new fall speed when it drops through the air', () => {
    const enemy = createDyingEnemy(AIRBORNE_TOP, NO_FALL_SPEED);

    const patched = patchDyingEnemy(LEVEL, enemy, TICK_SECONDS);

    expect(patched.position.x).toBe(ENEMY_LEFT);
    expect(patched.position.y).toBeCloseTo(FALLEN_TOP, PRECISION);
  });

  it('should hold the fall at terminal velocity when the dying enemy is already falling fast', () => {
    const enemy = createDyingEnemy(AIRBORNE_TOP, PAST_TERMINAL_FALL_SPEED);

    const patched = patchDyingEnemy(LEVEL, enemy, TICK_SECONDS);

    expect(patched.velocity.y.current).toBe(TERMINAL_VELOCITY);
    expect(patched.position.y).toBeCloseTo(
      AIRBORNE_TOP + TERMINAL_VELOCITY * TICK_SECONDS,
      PRECISION,
    );
  });

  it('should put the dying enemy flush on top of the floor and stop its fall when it lands', () => {
    const enemy = createDyingEnemy(BEFORE_FLOOR_TOP, FAST_FALL_SPEED);

    const patched = patchDyingEnemy(LEVEL, enemy, TICK_SECONDS);

    expect(patched.position.y).toBe(ON_FLOOR_TOP);
    expect(patched.velocity.y.current).toBe(NO_FALL_SPEED);
  });

  it('should only move the dying enemy by one longest tick when the frame takes too long', () => {
    const enemy = createDyingEnemy(AIRBORNE_TOP, NO_FALL_SPEED);

    const patched = patchDyingEnemy(LEVEL, enemy, LONG_TICK_SECONDS);

    expect(patched.velocity.y.current).toBeCloseTo(
      GRAVITY * MAX_TICK_SECONDS,
      PRECISION,
    );
    expect(patched.position.y).toBeCloseTo(
      AIRBORNE_TOP + GRAVITY * MAX_TICK_SECONDS * MAX_TICK_SECONDS,
      PRECISION,
    );
  });

  it('should keep the death clock and the sideways motion when the dying enemy falls', () => {
    const enemy = createDyingEnemy(AIRBORNE_TOP, NO_FALL_SPEED);

    const patched = patchDyingEnemy(LEVEL, enemy, TICK_SECONDS);

    expect(patched.timers).toBe(enemy.timers);
    expect(patched.velocity.x).toBe(enemy.velocity.x);
    expect(patched.statuses).toBe(enemy.statuses);
  });

  it('should leave the given enemy unchanged when the dying enemy falls', () => {
    const enemy = createDyingEnemy(AIRBORNE_TOP, NO_FALL_SPEED);

    patchDyingEnemy(LEVEL, enemy, TICK_SECONDS);

    expect(enemy).toEqual(createDyingEnemy(AIRBORNE_TOP, NO_FALL_SPEED));
  });
});
