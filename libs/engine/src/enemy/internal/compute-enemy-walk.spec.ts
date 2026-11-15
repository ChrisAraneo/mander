import {
  type Enemy,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FACING_LEFT, FACING_RIGHT } from '../../facing/consts';
import { ENEMY_JUMP_VELOCITY, ENEMY_MOVE_SPEED } from '../consts';
import { computeEnemyWalk } from './compute-enemy-walk';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['......', '......', '...#..', '######'];

const createLevel = (): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const ENEMY_TOP = 74;
const OPEN_LEFT = 40;
const BEFORE_WALL_LEFT = 72;
const TICK_SECONDS = 0.04;
const PRECISION = 6;
const OPEN_RIGHT_LEFT = 43.12;
const FLUSH_WITH_WALL_LEFT = 74;

const LEVEL = createLevel();

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

describe('computeEnemyWalk', () => {
  it('should move the enemy the whole way and keep its facing when nothing is in the way', () => {
    const walk = computeEnemyWalk(
      LEVEL,
      createWalkingEnemy(OPEN_LEFT),
      FACING_RIGHT,
      TICK_SECONDS,
    );

    expect(walk.nextX).toBeCloseTo(OPEN_RIGHT_LEFT, PRECISION);
    expect(walk.facing).toBe(FACING_RIGHT);
  });

  it('should stop the enemy flush against the wall and turn it round when a solid tile is in the way', () => {
    const walk = computeEnemyWalk(
      LEVEL,
      createWalkingEnemy(BEFORE_WALL_LEFT),
      FACING_RIGHT,
      TICK_SECONDS,
    );

    expect(walk.nextX).toBe(FLUSH_WITH_WALL_LEFT);
    expect(walk.facing).toBe(FACING_LEFT);
  });

  it('should leave the enemy unchanged when it works out the walk', () => {
    const enemy = createWalkingEnemy(OPEN_LEFT);

    computeEnemyWalk(LEVEL, enemy, FACING_RIGHT, TICK_SECONDS);

    expect(enemy).toEqual(createWalkingEnemy(OPEN_LEFT));
  });
});
