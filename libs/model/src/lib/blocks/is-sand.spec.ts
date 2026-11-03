import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import type { Level } from '../types/level';
import { isSand } from './is-sand';
import { TILE_DIRT } from './tile-dirt';
import { TILE_SAND } from './tile-sand';

const LEVEL: Level = {
  seed: 'SEED',
  width: 2,
  height: 2,
  tiles: [
    [TILE_SAND, TILE_AIR],
    [TILE_SAND, TILE_DIRT],
  ],
  chestItems: [],
};

describe('isSand', () => {
  it('should return true when the tile is sand', () => {
    expect(isSand(LEVEL, 0, 0)).toBe(true);
    expect(isSand(LEVEL, 0, 1)).toBe(true);
  });

  it('should return false when the tile is air', () => {
    expect(isSand(LEVEL, 1, 0)).toBe(false);
  });

  it('should return false when the tile is another kind of block', () => {
    expect(isSand(LEVEL, 1, 1)).toBe(false);
  });

  it('should return false when the coordinates are past the left edge', () => {
    expect(isSand(LEVEL, -1, 0)).toBe(false);
  });

  it('should return false when the coordinates are past the right edge', () => {
    expect(isSand(LEVEL, 2, 0)).toBe(false);
  });

  it('should return false when the coordinates are above the level', () => {
    expect(isSand(LEVEL, 0, -1)).toBe(false);
  });

  it('should return false when the coordinates are below the level', () => {
    expect(isSand(LEVEL, 0, 2)).toBe(false);
  });
});
