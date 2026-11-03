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

const DIRT_X = 4;

const SAND_X = 68;

const createEnemy = (x: number, isGrounded: boolean): Enemy => ({
  kind: 'HOPPING',
  position: { x, y: 74 },
  velocity: { x: { current: 78, max: 78 }, y: { current: 0, max: 430 } },
  timers: { death: null, reload: 0 },
  spawn: { x, y: 74 },
  statuses: { isFacingRight: true, isGrounded },
});

describe('computeEnemyWalkSpeed', () => {
  it('should give the top speed of the enemy when it walks on another kind of block', () => {
    expect(computeEnemyWalkSpeed(LEVEL, createEnemy(DIRT_X, true))).toBe(78);
  });

  it('should give 0.65 of the top speed of the enemy when it walks on sand', () => {
    expect(computeEnemyWalkSpeed(LEVEL, createEnemy(SAND_X, true))).toBe(
      78 * SAND_MOVE_FACTOR,
    );
  });

  it('should give the top speed of the enemy when it is in the air above sand', () => {
    expect(computeEnemyWalkSpeed(LEVEL, createEnemy(SAND_X, false))).toBe(78);
  });
});
