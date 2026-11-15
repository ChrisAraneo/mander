import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FACING_LEFT, FACING_RIGHT } from '../../facing/consts';
import type { GameLevel } from '../../state/types/game-level';
import { FLYING_ENEMY_MOVE_SPEED } from '../consts';
import { computeFlyingEnemyTarget } from './compute-flying-enemy-target';
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
const PRECISION = 6;

const createFlyingEnemy = (top: number, velocityY: number): Enemy => ({
  ...BASE_ENEMY,
  position: { x: ENEMY_LEFT, y: top },
  spawn: { x: ENEMY_LEFT, y: SPAWN_TOP },
  velocity: {
    ...BASE_ENEMY.velocity,
    y: { current: velocityY, max: FLYING_ENEMY_MOVE_SPEED },
  },
});

describe('computeFlyingEnemyTarget', () => {
  it('should aim the enemy a tick further down when it heads down', () => {
    const target = computeFlyingEnemyTarget({
      level: OPEN_LEVEL,
      enemy: createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
      deltaSeconds: TICK_SECONDS,
      speed: FLYING_ENEMY_MOVE_SPEED,
      facing: FACING_RIGHT,
    });

    expect(target.rawNextY).toBeCloseTo(
      SPAWN_TOP + FLYING_ENEMY_MOVE_SPEED * TICK_SECONDS,
      PRECISION,
    );
  });

  it('should aim the enemy a tick further up when it heads up', () => {
    const target = computeFlyingEnemyTarget({
      level: OPEN_LEVEL,
      enemy: createFlyingEnemy(SPAWN_TOP, -FLYING_ENEMY_MOVE_SPEED),
      deltaSeconds: TICK_SECONDS,
      speed: FLYING_ENEMY_MOVE_SPEED,
      facing: FACING_LEFT,
    });

    expect(target.rawNextY).toBeCloseTo(
      SPAWN_TOP - FLYING_ENEMY_MOVE_SPEED * TICK_SECONDS,
      PRECISION,
    );
  });

  it('should hold the target within the range of the enemy when it works out the target', () => {
    const target = computeFlyingEnemyTarget({
      level: OPEN_LEVEL,
      enemy: createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
      deltaSeconds: TICK_SECONDS,
      speed: FLYING_ENEMY_MOVE_SPEED,
      facing: FACING_RIGHT,
    });

    expect(target.clampedNextY).toBe(target.rawNextY);
  });

  it('should pass the level on unchanged when it works out the target', () => {
    const target = computeFlyingEnemyTarget({
      level: OPEN_LEVEL,
      enemy: createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
      deltaSeconds: TICK_SECONDS,
      speed: FLYING_ENEMY_MOVE_SPEED,
      facing: FACING_RIGHT,
    });

    expect(target.level).toBe(OPEN_LEVEL);
  });
});
