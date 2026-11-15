import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPIKE } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FACING_LEFT, FACING_RIGHT } from '../../facing/consts';
import type { GameLevel } from '../../state/types/game-level';
import { isWallAhead } from './is-wall-ahead';

const BEFORE_WALL_LEFT = 41;
const PAST_WALL_LEFT = 96;
const LEVEL_EDGE_LEFT = 0;
const OPEN_AIR_LEFT = 10;
const LOWER_PART_TOP = 20;
const ROW_BELOW_TOP = 2;

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
    const isWall = isWallAhead(
      LEVEL,
      BEFORE_WALL_LEFT,
      WALL_ROW_TOP,
      FACING_RIGHT,
    );

    expect(isWall).toBe(true);
  });

  it('should say yes when the enemy walking left is about to reach a wall', () => {
    const isWall = isWallAhead(
      LEVEL,
      PAST_WALL_LEFT,
      WALL_ROW_TOP,
      FACING_LEFT,
    );

    expect(isWall).toBe(true);
  });

  it('should say yes when only the lower part of the enemy is level with the wall', () => {
    const isWall = isWallAhead(
      LEVEL,
      BEFORE_WALL_LEFT,
      LOWER_PART_TOP,
      FACING_RIGHT,
    );

    expect(isWall).toBe(true);
  });

  it('should say yes when the enemy walking left reaches the side of the level', () => {
    const isWall = isWallAhead(
      LEVEL,
      LEVEL_EDGE_LEFT,
      WALL_ROW_TOP,
      FACING_LEFT,
    );

    expect(isWall).toBe(true);
  });

  it('should say no when the wall is behind the enemy', () => {
    const isWall = isWallAhead(
      LEVEL,
      BEFORE_WALL_LEFT,
      WALL_ROW_TOP,
      FACING_LEFT,
    );

    expect(isWall).toBe(false);
  });

  it('should say no when the enemy has open air ahead', () => {
    const isWall = isWallAhead(
      LEVEL,
      OPEN_AIR_LEFT,
      WALL_ROW_TOP,
      FACING_RIGHT,
    );

    expect(isWall).toBe(false);
  });

  it('should say no when the wall is in the row below the enemy', () => {
    const isWall = isWallAhead(
      LEVEL,
      BEFORE_WALL_LEFT,
      ROW_BELOW_TOP,
      FACING_RIGHT,
    );

    expect(isWall).toBe(false);
  });

  it('should say no when the tile ahead of the enemy is a spike', () => {
    const isWall = isWallAhead(
      SPIKED_LEVEL,
      BEFORE_WALL_LEFT,
      WALL_ROW_TOP,
      FACING_RIGHT,
    );

    expect(isWall).toBe(false);
  });
});
