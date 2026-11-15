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
import { createFlyingEnemyTarget } from './create-flying-enemy-target';
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

const WITHIN_RANGE_TOP = 110;
const PAST_RANGE_BELOW_TOP = 400;
const PAST_RANGE_ABOVE_TOP = -400;

describe('createFlyingEnemyTarget', () => {
  it('should keep the target where it is when the enemy stays within its range', () => {
    const target = createFlyingEnemyTarget(
      {
        level: OPEN_LEVEL,
        enemy: createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
        speed: FLYING_ENEMY_MOVE_SPEED,
        facing: FACING_RIGHT,
      },
      WITHIN_RANGE_TOP,
    );

    expect(target.clampedNextY).toBe(WITHIN_RANGE_TOP);
    expect(target.rawNextY).toBe(WITHIN_RANGE_TOP);
  });

  it('should pull the target back to the bottom of the range when the enemy would fly past it', () => {
    const target = createFlyingEnemyTarget(
      {
        level: OPEN_LEVEL,
        enemy: createFlyingEnemy(SPAWN_TOP, FLYING_ENEMY_MOVE_SPEED),
        speed: FLYING_ENEMY_MOVE_SPEED,
        facing: FACING_RIGHT,
      },
      PAST_RANGE_BELOW_TOP,
    );

    expect(target.clampedNextY).toBe(SPAWN_TOP + FLYING_ENEMY_RANGE);
  });

  it('should pull the target back to the top of the range when the enemy would fly past it', () => {
    const target = createFlyingEnemyTarget(
      {
        level: OPEN_LEVEL,
        enemy: createFlyingEnemy(SPAWN_TOP, -FLYING_ENEMY_MOVE_SPEED),
        speed: FLYING_ENEMY_MOVE_SPEED,
        facing: FACING_LEFT,
      },
      PAST_RANGE_ABOVE_TOP,
    );

    expect(target.clampedNextY).toBe(SPAWN_TOP - FLYING_ENEMY_RANGE);
  });

  it('should pass the heading on unchanged when it works out the target', () => {
    const target = createFlyingEnemyTarget(
      {
        level: OPEN_LEVEL,
        enemy: createFlyingEnemy(SPAWN_TOP, -FLYING_ENEMY_MOVE_SPEED),
        speed: FLYING_ENEMY_MOVE_SPEED,
        facing: FACING_LEFT,
      },
      WITHIN_RANGE_TOP,
    );

    expect(target.facing).toBe(FACING_LEFT);
    expect(target.speed).toBe(FLYING_ENEMY_MOVE_SPEED);
  });
});
