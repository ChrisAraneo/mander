import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import { getSpikeShape } from './get-spike-shape';
import { TILE_SPIKE } from './tile-spike';
import { TILE_SPIKE_CEILING } from './tile-spike-ceiling';

const createRowLevel = (...tiles: Tile[]): Level => ({
  seed: 'SEED',
  width: size(tiles),
  height: 1,
  tiles: [tiles],
  chestItems: [],
});

describe('getSpikeShape', () => {
  it('should return single when there is no spike on either side', () => {
    expect(
      getSpikeShape(createRowLevel(TILE_AIR, TILE_SPIKE, TILE_AIR), 1, 0),
    ).toBe('SINGLE');
  });

  it('should return strip when a spike is on its left', () => {
    expect(
      getSpikeShape(createRowLevel(TILE_SPIKE, TILE_SPIKE, TILE_AIR), 1, 0),
    ).toBe('STRIP');
  });

  it('should return strip when a spike is on its right', () => {
    expect(
      getSpikeShape(createRowLevel(TILE_AIR, TILE_SPIKE, TILE_SPIKE), 1, 0),
    ).toBe('STRIP');
  });

  it('should return strip for every spike when the whole row is spikes', () => {
    const level = createRowLevel(TILE_SPIKE, TILE_SPIKE, TILE_SPIKE);

    expect(getSpikeShape(level, 0, 0)).toBe('STRIP');
    expect(getSpikeShape(level, 1, 0)).toBe('STRIP');
    expect(getSpikeShape(level, 2, 0)).toBe('STRIP');
  });

  it('should return strip when a ceiling spike is next to another ceiling spike', () => {
    expect(
      getSpikeShape(
        createRowLevel(TILE_SPIKE_CEILING, TILE_SPIKE_CEILING, TILE_AIR),
        1,
        0,
      ),
    ).toBe('STRIP');
  });

  it('should return single when the spikes next to it face the other way', () => {
    expect(
      getSpikeShape(
        createRowLevel(TILE_SPIKE_CEILING, TILE_SPIKE, TILE_SPIKE_CEILING),
        1,
        0,
      ),
    ).toBe('SINGLE');
  });

  it('should return single when the spike is at the left edge of the level', () => {
    expect(getSpikeShape(createRowLevel(TILE_SPIKE, TILE_AIR), 0, 0)).toBe(
      'SINGLE',
    );
  });

  it('should return single when the spike is at the right edge of the level', () => {
    expect(getSpikeShape(createRowLevel(TILE_AIR, TILE_SPIKE), 1, 0)).toBe(
      'SINGLE',
    );
  });
});
