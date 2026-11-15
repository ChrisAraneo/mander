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

import { SAND_MOVE_FACTOR } from '../../sand/consts';
import { ENEMY_JUMP_VELOCITY, ENEMY_MOVE_SPEED } from '../consts';
import { computeEnemyWalkSpeed } from './compute-enemy-walk-speed';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  s: TILE_SAND,
};

const ROWS = ['....', '....', '....', '##ss'];

const LEVEL: Level = {
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
};

const DIRT_LEFT = 4;

const SAND_LEFT = 68;

const ENEMY_TOP = 74;

const createEnemy = (left: number, isGrounded: boolean): Enemy => ({
  kind: 'HOPPING',
  position: { x: left, y: ENEMY_TOP },
  velocity: {
    x: { current: ENEMY_MOVE_SPEED, max: ENEMY_MOVE_SPEED },
    y: { current: 0, max: ENEMY_JUMP_VELOCITY },
  },
  timers: { death: null, reload: 0 },
  spawn: { x: left, y: ENEMY_TOP },
  statuses: { isFacingRight: true, isGrounded },
});

describe('computeEnemyWalkSpeed', () => {
  it('should give the top speed of the enemy when it walks on another kind of block', () => {
    expect(computeEnemyWalkSpeed(LEVEL, createEnemy(DIRT_LEFT, true))).toBe(
      ENEMY_MOVE_SPEED,
    );
  });

  it('should slow the enemy down when it walks on sand', () => {
    expect(computeEnemyWalkSpeed(LEVEL, createEnemy(SAND_LEFT, true))).toBe(
      ENEMY_MOVE_SPEED * SAND_MOVE_FACTOR,
    );
  });

  it('should give the top speed of the enemy when it is in the air above sand', () => {
    expect(computeEnemyWalkSpeed(LEVEL, createEnemy(SAND_LEFT, false))).toBe(
      ENEMY_MOVE_SPEED,
    );
  });
});
