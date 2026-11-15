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

import type { GameLevel } from '../../state/types/game-level';
import { computeDyingEnemyDelta } from './compute-dying-enemy-delta';
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
const TICK_SECONDS = 0.02;
const LONG_TICK_SECONDS = 1;

const createDyingEnemy = (top: number, velocityY: number): Enemy => ({
  ...BASE_ENEMY,
  position: { x: ENEMY_LEFT, y: top },
  velocity: {
    ...BASE_ENEMY.velocity,
    y: { ...BASE_ENEMY.velocity.y, current: velocityY },
  },
  timers: { death: DYING_SECONDS, reload: 0 },
});

describe('computeDyingEnemyDelta', () => {
  it('should use the elapsed time as it is when the tick is shorter than the longest allowed tick', () => {
    const step = computeDyingEnemyDelta({
      level: LEVEL,
      enemy: createDyingEnemy(AIRBORNE_TOP, NO_FALL_SPEED),
      elapsedSeconds: TICK_SECONDS,
    });

    expect(step.deltaSeconds).toBe(TICK_SECONDS);
  });

  it('should cut the elapsed time down to the longest allowed tick when the tick is longer', () => {
    const step = computeDyingEnemyDelta({
      level: LEVEL,
      enemy: createDyingEnemy(AIRBORNE_TOP, NO_FALL_SPEED),
      elapsedSeconds: LONG_TICK_SECONDS,
    });

    expect(step.deltaSeconds).toBe(MAX_TICK_SECONDS);
  });

  it('should pass the level on unchanged when it measures the tick', () => {
    const step = computeDyingEnemyDelta({
      level: LEVEL,
      enemy: createDyingEnemy(AIRBORNE_TOP, NO_FALL_SPEED),
      elapsedSeconds: TICK_SECONDS,
    });

    expect(step.level).toBe(LEVEL);
  });

  it('should pass the enemy on unchanged when it measures the tick', () => {
    const enemy = createDyingEnemy(AIRBORNE_TOP, NO_FALL_SPEED);

    const step = computeDyingEnemyDelta({
      level: LEVEL,
      enemy,
      elapsedSeconds: TICK_SECONDS,
    });

    expect(step.enemy).toBe(enemy);
  });
});
