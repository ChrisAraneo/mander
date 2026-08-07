import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_DIRT } from '../blocks/dirt';
import type { Level } from '../level/level';
import { isSpike } from './is-spike';
import { TILE_SPIKE, TILE_SPIKE_CEILING } from './spike';

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
  it('should find a spike when the tile holds teeth standing on the floor', () => {
    expect(isSpike(LEVEL, 0, 1)).toBe(true);
  });

  it('should find a spike when the tile holds teeth hanging from the ceiling', () => {
    expect(isSpike(LEVEL, 0, 0)).toBe(true);
  });

  it('should find no spike when the tile is open air', () => {
    expect(isSpike(LEVEL, 1, 0)).toBe(false);
  });

  it('should find no spike when the tile is a block', () => {
    expect(isSpike(LEVEL, 1, 1)).toBe(false);
  });

  it('should find no spike when the coordinates lie past the left edge', () => {
    expect(isSpike(LEVEL, -1, 0)).toBe(false);
  });

  it('should find no spike when the coordinates lie past the right edge', () => {
    expect(isSpike(LEVEL, 2, 0)).toBe(false);
  });

  it('should find no spike when the coordinates lie above the ceiling', () => {
    expect(isSpike(LEVEL, 0, -1)).toBe(false);
  });

  it('should find no spike when the coordinates lie below the floor', () => {
    expect(isSpike(LEVEL, 0, 2)).toBe(false);
  });
});
