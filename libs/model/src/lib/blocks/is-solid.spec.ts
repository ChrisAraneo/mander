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
  it('should return true when the coordinates hold a solid tile', () => {
    expect(isSolid(LEVEL, 1, 0)).toBe(true);
  });

  it('should return false when the coordinates hold air', () => {
    expect(isSolid(LEVEL, 0, 0)).toBe(false);
  });

  it('should return false when the coordinates hold a non-blocking tile', () => {
    expect(isSolid(LEVEL, 0, 1)).toBe(false);
  });

  it('should return true when x lies past the left edge of the level', () => {
    expect(isSolid(LEVEL, -1, 0)).toBe(true);
  });

  it('should return true when x lies past the right edge of the level', () => {
    expect(isSolid(LEVEL, 2, 0)).toBe(true);
  });

  it('should return false when y lies above the top of the level', () => {
    expect(isSolid(LEVEL, 0, -1)).toBe(false);
  });

  it('should return false when y lies below the bottom of the level', () => {
    expect(isSolid(LEVEL, 0, 2)).toBe(false);
  });

  it('should return true when both x and y lie outside the level', () => {
    expect(isSolid(LEVEL, -1, -1)).toBe(true);
    expect(isSolid(LEVEL, 2, 2)).toBe(true);
  });

  it('should return true when x is past a side wall, whatever row it asks about', () => {
    expect(isSolid(LEVEL, -1, 5)).toBe(true);
    expect(isSolid(LEVEL, 2, -5)).toBe(true);
  });

  it('should return false when the coordinates lie far below the level, so a fall never ends', () => {
    expect(isSolid(LEVEL, 0, 100)).toBe(false);
    expect(isSolid(LEVEL, 1, 100)).toBe(false);
  });
});
