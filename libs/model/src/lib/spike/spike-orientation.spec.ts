import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_DIRT } from '../blocks/dirt';
import type { Level } from '../level/level';
import { TILE_SPIKE, TILE_SPIKE_CEILING } from './spike';
import { spikeOrientation } from './spike-orientation';

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

describe('spikeOrientation', () => {
  it('should hang the teeth from above when the tile is a ceiling spike', () => {
    expect(spikeOrientation(LEVEL, 0, 0)).toBe('CEILING');
  });

  it('should stand the teeth on the ground when the tile is an ordinary spike', () => {
    expect(spikeOrientation(LEVEL, 0, 1)).toBe('FLOOR');
  });

  it('should read the tile as standing on the ground when it is no spike at all', () => {
    expect(spikeOrientation(LEVEL, 1, 0)).toBe('FLOOR');
    expect(spikeOrientation(LEVEL, 1, 1)).toBe('FLOOR');
  });

  it('should read the tile as standing on the ground when it lies in the void past an edge', () => {
    expect(spikeOrientation(LEVEL, -1, 0)).toBe('FLOOR');
    expect(spikeOrientation(LEVEL, 2, 0)).toBe('FLOOR');
    expect(spikeOrientation(LEVEL, 0, -1)).toBe('FLOOR');
    expect(spikeOrientation(LEVEL, 0, 2)).toBe('FLOOR');
  });
});
