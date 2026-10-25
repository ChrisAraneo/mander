import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import type { Level } from '../types/level';
import { isSpike } from './is-spike';
import { TILE_SPIKE } from './tile-spike';
import { TILE_SPIKE_CEILING } from './tile-spike-ceiling';

const LEVEL: Level = {
  seed: 'SEED',
  width: 2,
  height: 2,
  tiles: [
    [TILE_SPIKE_CEILING, TILE_AIR],
    [TILE_SPIKE, TILE_DIRT],
  ],
  chestItems: [],
};

describe('isSpike', () => {
  it('should return true when the tile is a floor spike', () => {
    expect(isSpike(LEVEL, 0, 1)).toBe(true);
  });

  it('should return true when the tile is a ceiling spike', () => {
    expect(isSpike(LEVEL, 0, 0)).toBe(true);
  });

  it('should return false when the tile is air', () => {
    expect(isSpike(LEVEL, 1, 0)).toBe(false);
  });

  it('should return false when the tile is a block', () => {
    expect(isSpike(LEVEL, 1, 1)).toBe(false);
  });

  it('should return false when the coordinates lie past the left edge', () => {
    expect(isSpike(LEVEL, -1, 0)).toBe(false);
  });

  it('should return false when the coordinates lie past the right edge', () => {
    expect(isSpike(LEVEL, 2, 0)).toBe(false);
  });

  it('should return false when the coordinates lie above the level', () => {
    expect(isSpike(LEVEL, 0, -1)).toBe(false);
  });

  it('should return false when the coordinates lie below the level', () => {
    expect(isSpike(LEVEL, 0, 2)).toBe(false);
  });
});
