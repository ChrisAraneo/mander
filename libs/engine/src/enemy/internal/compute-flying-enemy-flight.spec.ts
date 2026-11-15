import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { MAX_TICK_SECONDS } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FACING_LEFT, FACING_RIGHT } from '../../facing/consts';
import type { GameLevel } from '../../state/types/game-level';
import { FLYING_ENEMY_MOVE_SPEED } from '../consts';
import { computeFlyingEnemyFlight } from './compute-flying-enemy-flight';
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

const OPEN_LEVEL = createLevel([
  '.....',
  '..e..',
  '.....',
  '.....',
  '.....',
  '.....',
]);

const BASE_ENEMY = createPatrols(OPEN_LEVEL)[0];

const ENEMY_LEFT = 40;
const SPAWN_TOP = 100;
const TICK_SECONDS = 0.02;

const createFlyingEnemy = (top: number, velocityY: number): Enemy => ({
  ...BASE_ENEMY,
  position: { x: ENEMY_LEFT, y: top },
  spawn: { x: ENEMY_LEFT, y: SPAWN_TOP },
  velocity: {
    ...BASE_ENEMY.velocity,
    y: { current: velocityY, max: FLYING_ENEMY_MOVE_SPEED },
  },
});

const LONG_TICK_SECONDS = 1;

describe('computeFlyingEnemyFlight', () => {
  it('should use the elapsed time as it is when the tick is shorter than the longest allowed tick', () => {
    const step = computeFlyingEnemyFlight({
      level: OPEN_LEVEL,
      enemy: createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
      elapsedSeconds: TICK_SECONDS,
    });

    expect(step.deltaSeconds).toBe(TICK_SECONDS);
  });

  it('should cut the elapsed time down to the longest allowed tick when the tick is longer', () => {
    const step = computeFlyingEnemyFlight({
      level: OPEN_LEVEL,
      enemy: createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
      elapsedSeconds: LONG_TICK_SECONDS,
    });

    expect(step.deltaSeconds).toBe(MAX_TICK_SECONDS);
  });

  it('should take the flying speed from the top speed of the enemy when it reads the flight', () => {
    const step = computeFlyingEnemyFlight({
      level: OPEN_LEVEL,
      enemy: createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
      elapsedSeconds: TICK_SECONDS,
    });

    expect(step.speed).toBe(FLYING_ENEMY_MOVE_SPEED);
  });

  it('should say the enemy is heading down when it is already moving down', () => {
    const step = computeFlyingEnemyFlight({
      level: OPEN_LEVEL,
      enemy: createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
      elapsedSeconds: TICK_SECONDS,
    });

    expect(step.facing).toBe(FACING_RIGHT);
  });

  it('should say the enemy is heading up when it is already moving up', () => {
    const step = computeFlyingEnemyFlight({
      level: OPEN_LEVEL,
      enemy: createFlyingEnemy(SPAWN_TOP, -FLYING_ENEMY_MOVE_SPEED),
      elapsedSeconds: TICK_SECONDS,
    });

    expect(step.facing).toBe(FACING_LEFT);
  });

  it('should pass the level on unchanged when it reads the flight', () => {
    const step = computeFlyingEnemyFlight({
      level: OPEN_LEVEL,
      enemy: createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
      elapsedSeconds: TICK_SECONDS,
    });

    expect(step.level).toBe(OPEN_LEVEL);
  });
});
