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
import { FLYING_ENEMY_MOVE_SPEED, FLYING_ENEMY_RANGE } from '../consts';
import { computeFlyingEnemyDrift } from './compute-flying-enemy-drift';
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

const createFlyingEnemy = (top: number, velocityY: number): Enemy => ({
  ...BASE_ENEMY,
  position: { x: ENEMY_LEFT, y: top },
  spawn: { x: ENEMY_LEFT, y: SPAWN_TOP },
  velocity: {
    ...BASE_ENEMY.velocity,
    y: { current: velocityY, max: FLYING_ENEMY_MOVE_SPEED },
  },
});

const FLOORED_LEVEL = createLevel([
  '.....',
  '..e..',
  '.....',
  '.....',
  '#####',
]);

const NEXT_TOP = 110;
const PAST_FLOOR_TOP = 200;

describe('computeFlyingEnemyDrift', () => {
  it('should say the enemy was held back when the target was pulled into its range', () => {
    const drift = computeFlyingEnemyDrift({
      level: OPEN_LEVEL,
      enemy: createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
      speed: FLYING_ENEMY_MOVE_SPEED,
      facing: FACING_RIGHT,
      rawNextY: PAST_FLOOR_TOP,
      clampedNextY: SPAWN_TOP + FLYING_ENEMY_RANGE,
    });

    expect(drift.isClamped).toBe(true);
  });

  it('should say the enemy was not held back when the target was left where it was', () => {
    const drift = computeFlyingEnemyDrift({
      level: OPEN_LEVEL,
      enemy: createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
      speed: FLYING_ENEMY_MOVE_SPEED,
      facing: FACING_RIGHT,
      rawNextY: NEXT_TOP,
      clampedNextY: NEXT_TOP,
    });

    expect(drift.isClamped).toBe(false);
  });

  it('should move the enemy to the target when the way there is open', () => {
    const drift = computeFlyingEnemyDrift({
      level: OPEN_LEVEL,
      enemy: createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
      speed: FLYING_ENEMY_MOVE_SPEED,
      facing: FACING_RIGHT,
      rawNextY: NEXT_TOP,
      clampedNextY: NEXT_TOP,
    });

    expect(drift.vertical.position).toBe(NEXT_TOP);
    expect(drift.vertical.isBlocked).toBe(false);
  });

  it('should stop the enemy against the floor when a solid tile is on the way', () => {
    const drift = computeFlyingEnemyDrift({
      level: FLOORED_LEVEL,
      enemy: createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
      speed: FLYING_ENEMY_MOVE_SPEED,
      facing: FACING_RIGHT,
      rawNextY: PAST_FLOOR_TOP,
      clampedNextY: PAST_FLOOR_TOP,
    });

    expect(drift.vertical.isBlocked).toBe(true);
  });

  it('should pass the heading on unchanged when it moves the enemy', () => {
    const drift = computeFlyingEnemyDrift({
      level: OPEN_LEVEL,
      enemy: createFlyingEnemy(SPAWN_TOP, -FLYING_ENEMY_MOVE_SPEED),
      speed: FLYING_ENEMY_MOVE_SPEED,
      facing: FACING_LEFT,
      rawNextY: NEXT_TOP,
      clampedNextY: NEXT_TOP,
    });

    expect(drift.facing).toBe(FACING_LEFT);
    expect(drift.speed).toBe(FLYING_ENEMY_MOVE_SPEED);
  });
});
