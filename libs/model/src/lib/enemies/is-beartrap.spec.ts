import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_DIRT } from '../blocks/dirt';
import type { Level } from '../level/level';
import { TILE_BEARTRAP } from './beartrap-spawn';
import { isBeartrap } from './is-beartrap';

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
  it('should find a beartrap when the tile holds one', () => {
    expect(isBeartrap(LEVEL, 0, 0)).toBe(true);
  });

  it('should find no beartrap when the tile is open air', () => {
    expect(isBeartrap(LEVEL, 1, 0)).toBe(false);
  });

  it('should find no beartrap when the tile is a block', () => {
    expect(isBeartrap(LEVEL, 0, 1)).toBe(false);
  });

  it('should find no beartrap when the coordinates lie past the left edge', () => {
    expect(isBeartrap(LEVEL, -1, 0)).toBe(false);
  });

  it('should find no beartrap when the coordinates lie past the right edge', () => {
    expect(isBeartrap(LEVEL, 2, 0)).toBe(false);
  });

  it('should find no beartrap when the coordinates lie above the ceiling', () => {
    expect(isBeartrap(LEVEL, 0, -1)).toBe(false);
  });

  it('should find no beartrap when the coordinates lie below the floor', () => {
    expect(isBeartrap(LEVEL, 0, 2)).toBe(false);
  });
});
