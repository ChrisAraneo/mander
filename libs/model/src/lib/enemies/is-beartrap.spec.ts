import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import type { Level } from '../types/level';
import { isBeartrap } from './is-beartrap';
import { TILE_BEARTRAP } from './tile-beartrap';

const LEVEL: Level = {
  seed: 'SEED',
  width: 2,
  height: 2,
  tiles: [
    [TILE_BEARTRAP, TILE_AIR],
    [TILE_DIRT, TILE_DIRT],
  ],
  chestItems: [],
};

describe('isBeartrap', () => {
  it('should return true when the tile is a beartrap', () => {
    expect(isBeartrap(LEVEL, 0, 0)).toBe(true);
  });

  it('should return false when the tile is air', () => {
    expect(isBeartrap(LEVEL, 1, 0)).toBe(false);
  });

  it('should return false when the tile is a block', () => {
    expect(isBeartrap(LEVEL, 0, 1)).toBe(false);
  });

  it('should return false when the coordinates lie past the left edge', () => {
    expect(isBeartrap(LEVEL, -1, 0)).toBe(false);
  });

  it('should return false when the coordinates lie past the right edge', () => {
    expect(isBeartrap(LEVEL, 2, 0)).toBe(false);
  });

  it('should return false when the coordinates lie above the level', () => {
    expect(isBeartrap(LEVEL, 0, -1)).toBe(false);
  });

  it('should return false when the coordinates lie below the level', () => {
    expect(isBeartrap(LEVEL, 0, 2)).toBe(false);
  });
});
