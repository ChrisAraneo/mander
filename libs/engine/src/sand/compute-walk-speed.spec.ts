import {
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SAND,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeWalkSpeed } from './compute-walk-speed';
import { SAND_MOVE_FACTOR } from './consts';
import type { Walker } from './types/walker';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  s: TILE_SAND,
};

const ROWS = ['....', '....', '##ss'];

const LEVEL: Level = {
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
};

const WIDTH = 22;

const HEIGHT = 22;

const SPEED = 100;

const FLOOR_ROW = 2;

const SAND_COLUMN = 2;

const SAND_LEFT = SAND_COLUMN * TILE_SIZE;

const createWalker = (positionX: number, isGrounded: boolean): Walker => ({
  position: { x: positionX, y: FLOOR_ROW * TILE_SIZE - HEIGHT },
  statuses: { isGrounded },
});

describe('computeWalkSpeed', () => {
  it('should use 0.65 as the sand factor when the game is tuned', () => {
    expect(SAND_MOVE_FACTOR).toBe(0.65);
  });

  it('should slow the walker by the sand factor when they walk on sand', () => {
    expect(
      computeWalkSpeed(
        LEVEL,
        createWalker(SAND_LEFT, true),
        WIDTH,
        HEIGHT,
        SPEED,
      ),
    ).toBe(SPEED * SAND_MOVE_FACTOR);
  });

  it('should keep the speed when the walker is on another kind of block', () => {
    expect(
      computeWalkSpeed(LEVEL, createWalker(0, true), WIDTH, HEIGHT, SPEED),
    ).toBe(SPEED);
  });

  it('should keep the speed when the walker is in the air above sand', () => {
    expect(
      computeWalkSpeed(
        LEVEL,
        createWalker(SAND_LEFT, false),
        WIDTH,
        HEIGHT,
        SPEED,
      ),
    ).toBe(SPEED);
  });

  it('should leave the walker it was handed untouched when it works out the speed', () => {
    const walker = createWalker(SAND_LEFT, true);

    computeWalkSpeed(LEVEL, walker, WIDTH, HEIGHT, SPEED);

    expect(walker).toEqual(createWalker(SAND_LEFT, true));
  });
});
