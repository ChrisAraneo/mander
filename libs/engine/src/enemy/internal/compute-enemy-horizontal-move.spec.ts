import {
  type Enemy,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SAND,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FACING_LEFT, FACING_RIGHT } from '../../facing/consts';
import { ENEMY_JUMP_VELOCITY, ENEMY_MOVE_SPEED } from '../consts';
import { computeEnemyHorizontalMove } from './compute-enemy-horizontal-move';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  s: TILE_SAND,
};

const createLevel = (rows: string[]): Level => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const ROWS = ['......', '......', '...#..', '######'];

const LEVEL = createLevel(ROWS);

const SAND_LEVEL = createLevel(['......', '......', '......', 'ssssss']);

const ENEMY_TOP = 74;
const OPEN_LEFT = 40;
const BEFORE_WALL_LEFT = 72;
const TICK_SECONDS = 0.04;
const NO_TIME = 0;
const PRECISION = 6;
const OPEN_RIGHT_LEFT = 43.12;
const OPEN_LEFT_LEFT = 36.88;
const FLUSH_WITH_WALL_LEFT = 74;
const SAND_RIGHT_LEFT = 42.028;
const SAND_LEFT_LEFT = 37.972;

const createWalkingEnemy = (positionX: number): Enemy => ({
  kind: 'HOPPING',
  position: { x: positionX, y: ENEMY_TOP },
  velocity: {
    x: { current: ENEMY_MOVE_SPEED, max: ENEMY_MOVE_SPEED },
    y: { current: 0, max: ENEMY_JUMP_VELOCITY },
  },
  timers: { death: null, reload: 0 },
  spawn: { x: positionX, y: ENEMY_TOP },
  statuses: { isFacingRight: true, isGrounded: true },
});

describe('computeEnemyHorizontalMove', () => {
  it('should move the enemy the whole way at its top speed when nothing is in the way', () => {
    const move = computeEnemyHorizontalMove(
      LEVEL,
      createWalkingEnemy(OPEN_LEFT),
      FACING_RIGHT,
      TICK_SECONDS,
    );

    expect(move.position).toBeCloseTo(OPEN_RIGHT_LEFT, PRECISION);
    expect(move.isBlocked).toBe(false);
  });

  it('should move the enemy to the left when it faces left', () => {
    const move = computeEnemyHorizontalMove(
      LEVEL,
      createWalkingEnemy(OPEN_LEFT),
      FACING_LEFT,
      TICK_SECONDS,
    );

    expect(move.position).toBeCloseTo(OPEN_LEFT_LEFT, PRECISION);
    expect(move.isBlocked).toBe(false);
  });

  it('should stop the enemy flush against the wall when a solid tile is in the way', () => {
    const move = computeEnemyHorizontalMove(
      LEVEL,
      createWalkingEnemy(BEFORE_WALL_LEFT),
      FACING_RIGHT,
      TICK_SECONDS,
    );

    expect(move.position).toBe(FLUSH_WITH_WALL_LEFT);
    expect(move.isBlocked).toBe(true);
  });

  it('should leave the enemy where it is when no time has passed', () => {
    const move = computeEnemyHorizontalMove(
      LEVEL,
      createWalkingEnemy(OPEN_LEFT),
      FACING_RIGHT,
      NO_TIME,
    );

    expect(move.position).toBe(OPEN_LEFT);
    expect(move.isBlocked).toBe(false);
  });

  it('should slow the enemy down when it walks right on sand', () => {
    const move = computeEnemyHorizontalMove(
      SAND_LEVEL,
      createWalkingEnemy(OPEN_LEFT),
      FACING_RIGHT,
      TICK_SECONDS,
    );

    expect(move.position).toBeCloseTo(SAND_RIGHT_LEFT, PRECISION);
    expect(move.isBlocked).toBe(false);
  });

  it('should slow the enemy down when it walks left on sand', () => {
    const move = computeEnemyHorizontalMove(
      SAND_LEVEL,
      createWalkingEnemy(OPEN_LEFT),
      FACING_LEFT,
      TICK_SECONDS,
    );

    expect(move.position).toBeCloseTo(SAND_LEFT_LEFT, PRECISION);
  });
});
