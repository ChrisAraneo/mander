import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import type { Level } from '../level/level';
import { TILE_SPIKE } from '../spike/spike';
import { TILE_DIRT } from './dirt';
import { isSolid } from './is-solid';

const LEVEL: Level = {
  seed: 'SEED',
  width: 2,
  height: 2,
  tiles: [
    [TILE_AIR, TILE_DIRT],
    [TILE_SPIKE, TILE_AIR],
  ],
  chestItems: [],
};

describe('isSolid', () => {
  it('returns true for solid tile coordinates', () => {
    expect(isSolid(LEVEL, 1, 0)).toBe(true);
  });

  it('returns false for air tile coordinates', () => {
    expect(isSolid(LEVEL, 0, 0)).toBe(false);
  });

  it('returns false for non-blocking tile coordinates', () => {
    expect(isSolid(LEVEL, 0, 1)).toBe(false);
  });

  it('returns true for out-of-bounds coordinates (x < 0)', () => {
    expect(isSolid(LEVEL, -1, 0)).toBe(true);
  });

  it('returns true for out-of-bounds coordinates (x >= width)', () => {
    expect(isSolid(LEVEL, 2, 0)).toBe(true);
  });

  it('returns true for out-of-bounds coordinates (y < 0)', () => {
    expect(isSolid(LEVEL, 0, -1)).toBe(true);
  });

  it('returns true for out-of-bounds coordinates (y >= height)', () => {
    expect(isSolid(LEVEL, 0, 2)).toBe(true);
  });

  it('returns true for diagonal out-of-bounds coordinates', () => {
    expect(isSolid(LEVEL, -1, -1)).toBe(true);
    expect(isSolid(LEVEL, 2, 2)).toBe(true);
  });
});