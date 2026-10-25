import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import type { Level } from '../types/level';
import { getSpikeOrientation } from './get-spike-orientation';
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

describe('getSpikeOrientation', () => {
  it('should return ceiling when the tile is a ceiling spike', () => {
    expect(getSpikeOrientation(LEVEL, 0, 0)).toBe('CEILING');
  });

  it('should return floor when the tile is a floor spike', () => {
    expect(getSpikeOrientation(LEVEL, 0, 1)).toBe('FLOOR');
  });

  it('should return floor when the tile is not a spike', () => {
    expect(getSpikeOrientation(LEVEL, 1, 0)).toBe('FLOOR');
    expect(getSpikeOrientation(LEVEL, 1, 1)).toBe('FLOOR');
  });

  it('should return floor when the coordinates lie outside the level', () => {
    expect(getSpikeOrientation(LEVEL, -1, 0)).toBe('FLOOR');
    expect(getSpikeOrientation(LEVEL, 2, 0)).toBe('FLOOR');
    expect(getSpikeOrientation(LEVEL, 0, -1)).toBe('FLOOR');
    expect(getSpikeOrientation(LEVEL, 0, 2)).toBe('FLOOR');
  });
});
