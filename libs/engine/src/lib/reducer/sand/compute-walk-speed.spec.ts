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

import { SAND_MOVE_FACTOR } from './consts';
import { computeWalkSpeed } from './compute-walk-speed';
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

const createWalker = (x: number, isGrounded: boolean): Walker => ({
  position: { x, y: 2 * TILE_SIZE - HEIGHT },
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
        createWalker(2 * TILE_SIZE, true),
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
        createWalker(2 * TILE_SIZE, false),
        WIDTH,
        HEIGHT,
        SPEED,
      ),
    ).toBe(SPEED);
  });
});
