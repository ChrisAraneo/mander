import {
  type Snowball,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { SNOWBALL_SIZE, SNOWBALL_SPEED } from '../consts';
import { isSnowballOutOfLevel } from './is-snowball-out-of-level';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['..........', '..........', '##########'];

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

const LEVEL = createLevel(ROWS);

const LEVEL_RIGHT_EDGE = size(head(ROWS)) * TILE_SIZE;

const createSnowball = (left: number): Snowball => ({
  position: { x: left, y: TILE_SIZE },
  velocity: { x: { current: SNOWBALL_SPEED, max: SNOWBALL_SPEED } },
});

describe('isSnowballOutOfLevel', () => {
  it('should say yes when the snowball has fully left past the left edge of the level', () => {
    const isOut = isSnowballOutOfLevel(
      LEVEL,
      createSnowball(-SNOWBALL_SIZE - 0.5),
    );

    expect(isOut).toBe(true);
  });

  it('should say no when the right side of the snowball touches the left edge of the level', () => {
    const isOut = isSnowballOutOfLevel(LEVEL, createSnowball(-SNOWBALL_SIZE));

    expect(isOut).toBe(false);
  });

  it('should say yes when the snowball has passed the right edge of the level', () => {
    const isOut = isSnowballOutOfLevel(
      LEVEL,
      createSnowball(LEVEL_RIGHT_EDGE + 0.5),
    );

    expect(isOut).toBe(true);
  });

  it('should say no when the snowball sits exactly on the right edge of the level', () => {
    const isOut = isSnowballOutOfLevel(LEVEL, createSnowball(LEVEL_RIGHT_EDGE));

    expect(isOut).toBe(false);
  });

  it('should say no when the snowball is inside the level', () => {
    const isOut = isSnowballOutOfLevel(LEVEL, createSnowball(100));

    expect(isOut).toBe(false);
  });
});
