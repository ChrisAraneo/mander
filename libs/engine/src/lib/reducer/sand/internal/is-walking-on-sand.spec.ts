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

import type { Walker } from '../types/walker';
import { isWalkingOnSand } from './is-walking-on-sand';

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

const FLOOR_Y = 2 * TILE_SIZE - HEIGHT;

const createWalker = (x: number, y: number, isGrounded: boolean): Walker => ({
  position: { x, y },
  statuses: { isGrounded },
});

const checkWalker = (walker: Walker): boolean =>
  isWalkingOnSand(LEVEL, walker, WIDTH, HEIGHT);

describe('isWalkingOnSand', () => {
  it('should return true when the walker stands on a sand block', () => {
    expect(checkWalker(createWalker(2 * TILE_SIZE, FLOOR_Y, true))).toBe(true);
  });

  it('should return false when the walker stands on another kind of block', () => {
    expect(checkWalker(createWalker(0, FLOOR_Y, true))).toBe(false);
  });

  it('should return true when only part of the walker stands on sand', () => {
    expect(checkWalker(createWalker(2 * TILE_SIZE - 6, FLOOR_Y, true))).toBe(
      true,
    );
  });

  it('should return false when the walker is just clear of the sand', () => {
    expect(
      checkWalker(createWalker(2 * TILE_SIZE - WIDTH, FLOOR_Y, true)),
    ).toBe(false);
  });

  it('should return false when the walker is in the air above sand', () => {
    expect(checkWalker(createWalker(2 * TILE_SIZE, FLOOR_Y, false))).toBe(
      false,
    );
  });

  it('should return false when the walker stands past the edge of the level', () => {
    expect(checkWalker(createWalker(40 * TILE_SIZE, FLOOR_Y, true))).toBe(
      false,
    );
  });

  it('should return false when the walker is below the level', () => {
    expect(checkWalker(createWalker(2 * TILE_SIZE, 40 * TILE_SIZE, true))).toBe(
      false,
    );
  });
});
