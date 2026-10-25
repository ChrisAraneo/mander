import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import type { Level } from '../types/level';
import { isSpikeWithOrientation } from './is-spike-with-orientation';
import { TILE_SPIKE } from './tile-spike';
import { TILE_SPIKE_CEILING } from './tile-spike-ceiling';

const LEVEL: Level = {
  seed: 'SEED',
  width: 3,
  height: 1,
  tiles: [[TILE_SPIKE, TILE_SPIKE_CEILING, TILE_AIR]],
  chestItems: [],
};

describe('isSpikeWithOrientation', () => {
  it('should return true when the tile is a floor spike and the orientation is floor', () => {
    expect(isSpikeWithOrientation(LEVEL, 0, 0, 'FLOOR')).toBe(true);
  });

  it('should return true when the tile is a ceiling spike and the orientation is ceiling', () => {
    expect(isSpikeWithOrientation(LEVEL, 1, 0, 'CEILING')).toBe(true);
  });

  it('should return false when the spike faces the other way', () => {
    expect(isSpikeWithOrientation(LEVEL, 0, 0, 'CEILING')).toBe(false);
    expect(isSpikeWithOrientation(LEVEL, 1, 0, 'FLOOR')).toBe(false);
  });

  it('should return false when the tile is not a spike', () => {
    expect(isSpikeWithOrientation(LEVEL, 2, 0, 'FLOOR')).toBe(false);
  });

  it('should return false when the coordinates lie outside the level', () => {
    expect(isSpikeWithOrientation(LEVEL, -1, 0, 'FLOOR')).toBe(false);
    expect(isSpikeWithOrientation(LEVEL, 3, 0, 'FLOOR')).toBe(false);
  });
});
