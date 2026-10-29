import {
  type Cannonball,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { CANNONBALL_SIZE, CANNONBALL_SPEED } from '../consts';
import { isCannonballOutOfLevel } from './is-cannonball-out-of-level';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['..........', '..........', '##########'];

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(ROWS);

const LEVEL_RIGHT_EDGE = size(head(ROWS)) * TILE_SIZE;

const createCannonball = (left: number): Cannonball => ({
  position: { x: left, y: TILE_SIZE },
  velocity: { x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED } },
});

describe('isCannonballOutOfLevel', () => {
  it('should say yes when the cannonball has fully left past the left edge of the level', () => {
    const isOut = isCannonballOutOfLevel(
      LEVEL,
      createCannonball(-CANNONBALL_SIZE - 0.5),
    );

    expect(isOut).toBe(true);
  });

  it('should say no when the right side of the cannonball touches the left edge of the level', () => {
    const isOut = isCannonballOutOfLevel(
      LEVEL,
      createCannonball(-CANNONBALL_SIZE),
    );

    expect(isOut).toBe(false);
  });

  it('should say yes when the cannonball has passed the right edge of the level', () => {
    const isOut = isCannonballOutOfLevel(
      LEVEL,
      createCannonball(LEVEL_RIGHT_EDGE + 0.5),
    );

    expect(isOut).toBe(true);
  });

  it('should say no when the cannonball sits exactly on the right edge of the level', () => {
    const isOut = isCannonballOutOfLevel(
      LEVEL,
      createCannonball(LEVEL_RIGHT_EDGE),
    );

    expect(isOut).toBe(false);
  });

  it('should say no when the cannonball is inside the level', () => {
    const isOut = isCannonballOutOfLevel(LEVEL, createCannonball(100));

    expect(isOut).toBe(false);
  });
});
