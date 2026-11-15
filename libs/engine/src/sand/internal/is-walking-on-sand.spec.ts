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

const FLOOR_ROW = 2;

const FLOOR_Y = FLOOR_ROW * TILE_SIZE - HEIGHT;

const SAND_COLUMN = 2;

const SAND_LEFT = SAND_COLUMN * TILE_SIZE;

const FOOTPRINT_OVERHANG = 6;

const BEYOND_THE_LEVEL = 40 * TILE_SIZE;

const createWalker = (
  positionX: number,
  positionY: number,
  isGrounded: boolean,
): Walker => ({
  position: { x: positionX, y: positionY },
  statuses: { isGrounded },
});

const isWalkerOnSand = (walker: Walker): boolean =>
  isWalkingOnSand(LEVEL, walker, WIDTH, HEIGHT);

describe('isWalkingOnSand', () => {
  it('should say the walker is on sand when they stand on a sand block', () => {
    expect(isWalkerOnSand(createWalker(SAND_LEFT, FLOOR_Y, true))).toBe(true);
  });

  it('should say the walker is not on sand when they stand on another kind of block', () => {
    expect(isWalkerOnSand(createWalker(0, FLOOR_Y, true))).toBe(false);
  });

  it('should say the walker is on sand when only part of their footprint rests on it', () => {
    expect(
      isWalkerOnSand(
        createWalker(SAND_LEFT - FOOTPRINT_OVERHANG, FLOOR_Y, true),
      ),
    ).toBe(true);
  });

  it('should say the walker is not on sand when they stand just clear of it', () => {
    expect(isWalkerOnSand(createWalker(SAND_LEFT - WIDTH, FLOOR_Y, true))).toBe(
      false,
    );
  });

  it('should say the walker is not on sand when they are in the air above it', () => {
    expect(isWalkerOnSand(createWalker(SAND_LEFT, FLOOR_Y, false))).toBe(false);
  });

  it('should say the walker is not on sand when they stand past the edge of the level', () => {
    expect(isWalkerOnSand(createWalker(BEYOND_THE_LEVEL, FLOOR_Y, true))).toBe(
      false,
    );
  });

  it('should say the walker is not on sand when they are below the level', () => {
    expect(
      isWalkerOnSand(createWalker(SAND_LEFT, BEYOND_THE_LEVEL, true)),
    ).toBe(false);
  });
});
