import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import { computeDyingEnemyDrop } from './compute-dying-enemy-drop';
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
const BEFORE_FLOOR_TOP = 100;
const DYING_SECONDS = 0.1;
const SLOW_FALL_SPEED = 100;
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

describe('computeDyingEnemyDrop', () => {
  it('should move the dying enemy down the whole way when it falls through open air', () => {
    const step = computeDyingEnemyDrop({
      level: LEVEL,
      enemy: createDyingEnemy(AIRBORNE_TOP, SLOW_FALL_SPEED),
      deltaSeconds: TICK_SECONDS,
      velocityY: SLOW_FALL_SPEED,
    });

    expect(step.vertical.position).toBeCloseTo(
      AIRBORNE_TOP + SLOW_FALL_SPEED * TICK_SECONDS,
      PRECISION,
    );
    expect(step.vertical.isBlocked).toBe(false);
  });

  it('should stop the dying enemy against the floor when it falls onto a solid tile', () => {
    const step = computeDyingEnemyDrop({
      level: LEVEL,
      enemy: createDyingEnemy(BEFORE_FLOOR_TOP, SLOW_FALL_SPEED),
      deltaSeconds: LONG_TICK_SECONDS,
      velocityY: SLOW_FALL_SPEED,
    });

    expect(step.vertical.isBlocked).toBe(true);
  });

  it('should pass the fall speed on unchanged when it moves the enemy down', () => {
    const step = computeDyingEnemyDrop({
      level: LEVEL,
      enemy: createDyingEnemy(AIRBORNE_TOP, SLOW_FALL_SPEED),
      deltaSeconds: TICK_SECONDS,
      velocityY: SLOW_FALL_SPEED,
    });

    expect(step.velocityY).toBe(SLOW_FALL_SPEED);
  });

  it('should pass the enemy on unchanged when it moves the enemy down', () => {
    const enemy = createDyingEnemy(AIRBORNE_TOP, SLOW_FALL_SPEED);

    const step = computeDyingEnemyDrop({
      level: LEVEL,
      enemy,
      deltaSeconds: TICK_SECONDS,
      velocityY: SLOW_FALL_SPEED,
    });

    expect(step.enemy).toBe(enemy);
  });
});
