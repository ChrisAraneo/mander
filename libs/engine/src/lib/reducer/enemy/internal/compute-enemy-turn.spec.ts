import {
  type Tile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_SPIKE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { computeEnemyTurn } from './compute-enemy-turn';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  '^': TILE_SPIKE,
  b: TILE_BEARTRAP,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const OPEN_LEVEL = createLevel([
  '......',
  '......',
  '......',
  '######',
  '######',
]);

const WALL_LEVEL = createLevel([
  '......',
  '......',
  '...#..',
  '######',
  '######',
]);

const LEFT_WALL_LEVEL = createLevel([
  '......',
  '......',
  '..#...',
  '######',
  '######',
]);

const LEDGE_LEVEL = createLevel([
  '......',
  '......',
  '......',
  '###.##',
  '######',
]);

const SPIKE_LEVEL = createLevel([
  '......',
  '......',
  '...^..',
  '######',
  '######',
]);

const BEARTRAP_LEVEL = createLevel([
  '......',
  '......',
  '...b..',
  '######',
  '######',
]);

const ENEMY_X = 80;

const ENEMY_Y = 74;

describe('computeEnemyTurn', () => {
  it('should turn the enemy round when it walks on the ground into a wall', () => {
    const facing = computeEnemyTurn(WALL_LEVEL, ENEMY_X, ENEMY_Y, 1, true);

    expect(facing).toBe(-1);
  });

  it('should turn the enemy round when it walks left on the ground into a wall', () => {
    const facing = computeEnemyTurn(
      LEFT_WALL_LEVEL,
      ENEMY_X,
      ENEMY_Y,
      -1,
      true,
    );

    expect(facing).toBe(1);
  });

  it('should turn the enemy round when it walks on the ground up to a ledge', () => {
    const facing = computeEnemyTurn(LEDGE_LEVEL, ENEMY_X, ENEMY_Y, 1, true);

    expect(facing).toBe(-1);
  });

  it('should turn the enemy round when it walks on the ground up to a spike', () => {
    const facing = computeEnemyTurn(SPIKE_LEVEL, ENEMY_X, ENEMY_Y, 1, true);

    expect(facing).toBe(-1);
  });

  it('should turn the enemy round when it walks on the ground up to a beartrap', () => {
    const facing = computeEnemyTurn(BEARTRAP_LEVEL, ENEMY_X, ENEMY_Y, 1, true);

    expect(facing).toBe(-1);
  });

  it('should keep the enemy facing the same way when it is in the air in front of a wall', () => {
    const facing = computeEnemyTurn(WALL_LEVEL, ENEMY_X, ENEMY_Y, 1, false);

    expect(facing).toBe(1);
  });

  it('should keep the enemy facing the same way when it walks on open flat ground', () => {
    const facing = computeEnemyTurn(OPEN_LEVEL, ENEMY_X, ENEMY_Y, 1, true);

    expect(facing).toBe(1);
  });
});
