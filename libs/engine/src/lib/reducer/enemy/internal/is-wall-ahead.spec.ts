import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPIKE } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { isWallAhead } from './is-wall-ahead';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  '^': TILE_SPIKE,
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

const LEVEL = createLevel(['.....', '..#..', '#####']);

const SPIKED_LEVEL = createLevel(['.....', '..^..', '#####']);

const WALL_ROW_TOP = 34;

describe('isWallAhead', () => {
  it('should say yes when the enemy walking right is about to reach a wall', () => {
    const isWall = isWallAhead(LEVEL, 41, WALL_ROW_TOP, 1);

    expect(isWall).toBe(true);
  });

  it('should say yes when the enemy walking left is about to reach a wall', () => {
    const isWall = isWallAhead(LEVEL, 96, WALL_ROW_TOP, -1);

    expect(isWall).toBe(true);
  });

  it('should say yes when only the lower part of the enemy is level with the wall', () => {
    const isWall = isWallAhead(LEVEL, 41, 20, 1);

    expect(isWall).toBe(true);
  });

  it('should say yes when the enemy walking left reaches the side of the level', () => {
    const isWall = isWallAhead(LEVEL, 0, WALL_ROW_TOP, -1);

    expect(isWall).toBe(true);
  });

  it('should say no when the wall is behind the enemy', () => {
    const isWall = isWallAhead(LEVEL, 41, WALL_ROW_TOP, -1);

    expect(isWall).toBe(false);
  });

  it('should say no when the enemy has open air ahead', () => {
    const isWall = isWallAhead(LEVEL, 10, WALL_ROW_TOP, 1);

    expect(isWall).toBe(false);
  });

  it('should say no when the wall is in the row below the enemy', () => {
    const isWall = isWallAhead(LEVEL, 41, 2, 1);

    expect(isWall).toBe(false);
  });

  it('should say no when the tile ahead of the enemy is a spike', () => {
    const isWall = isWallAhead(SPIKED_LEVEL, 41, WALL_ROW_TOP, 1);

    expect(isWall).toBe(false);
  });
});
