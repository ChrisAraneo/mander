import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import type { Level } from '../types/level';
import { isIce } from './is-ice';
import { TILE_DIRT } from './tile-dirt';
import { TILE_ICE } from './tile-ice';

const LEVEL: Level = {
  seed: 'SEED',
  width: 2,
  height: 2,
  tiles: [
    [TILE_ICE, TILE_AIR],
    [TILE_ICE, TILE_DIRT],
  ],
  chestItems: [],
};

describe('isIce', () => {
  it('should return true when the tile is ice', () => {
    expect(isIce(LEVEL, 0, 0)).toBe(true);
    expect(isIce(LEVEL, 0, 1)).toBe(true);
  });

  it('should return false when the tile is air', () => {
    expect(isIce(LEVEL, 1, 0)).toBe(false);
  });

  it('should return false when the tile is another kind of block', () => {
    expect(isIce(LEVEL, 1, 1)).toBe(false);
  });

  it('should return false when the coordinates lie past the left edge', () => {
    expect(isIce(LEVEL, -1, 0)).toBe(false);
  });

  it('should return false when the coordinates lie past the right edge', () => {
    expect(isIce(LEVEL, 2, 0)).toBe(false);
  });

  it('should return false when the coordinates lie above the level', () => {
    expect(isIce(LEVEL, 0, -1)).toBe(false);
  });

  it('should return false when the coordinates lie below the level', () => {
    expect(isIce(LEVEL, 0, 2)).toBe(false);
  });
});
