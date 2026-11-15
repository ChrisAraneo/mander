import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { GRAVITY, TERMINAL_VELOCITY } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import { computeDyingEnemyFall } from './compute-dying-enemy-fall';
import { createPatrols } from './create-patrols';

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
const DYING_SECONDS = 0.1;
const NO_FALL_SPEED = 0;
const SLOW_FALL_SPEED = 100;
const TICK_SECONDS = 0.02;
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

describe('computeDyingEnemyFall', () => {
  it('should speed the fall up by gravity over the tick when the dying enemy falls slowly', () => {
    const step = computeDyingEnemyFall({
      level: LEVEL,
      enemy: createDyingEnemy(AIRBORNE_TOP, SLOW_FALL_SPEED),
      deltaSeconds: TICK_SECONDS,
    });

    expect(step.velocityY).toBeCloseTo(
      SLOW_FALL_SPEED + GRAVITY * TICK_SECONDS,
      PRECISION,
    );
  });

  it('should hold the fall at terminal velocity when gravity would push it past that speed', () => {
    const step = computeDyingEnemyFall({
      level: LEVEL,
      enemy: createDyingEnemy(AIRBORNE_TOP, TERMINAL_VELOCITY),
      deltaSeconds: TICK_SECONDS,
    });

    expect(step.velocityY).toBe(TERMINAL_VELOCITY);
  });

  it('should pass the tick length on unchanged when it applies gravity', () => {
    const step = computeDyingEnemyFall({
      level: LEVEL,
      enemy: createDyingEnemy(AIRBORNE_TOP, NO_FALL_SPEED),
      deltaSeconds: TICK_SECONDS,
    });

    expect(step.deltaSeconds).toBe(TICK_SECONDS);
  });

  it('should leave the given enemy unchanged when it applies gravity', () => {
    const enemy = createDyingEnemy(AIRBORNE_TOP, NO_FALL_SPEED);

    computeDyingEnemyFall({ level: LEVEL, enemy, deltaSeconds: TICK_SECONDS });

    expect(enemy).toEqual(createDyingEnemy(AIRBORNE_TOP, NO_FALL_SPEED));
  });
});
