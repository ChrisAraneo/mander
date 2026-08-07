import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import type { Level } from '../level/level';
import type { Tile } from '../tile/tile';
import { TILE_SPIKE, TILE_SPIKE_CEILING } from './spike';
import { spikeShape } from './spike-shape';

const row = (...tiles: Tile[]): Level => ({
  seed: 'SEED',
  width: tiles.length,
  height: 1,
  tiles: [tiles],
  chestItems: [],
});

describe('spikeShape', () => {
  it('should leave a tooth standing on its own when there is a gap either side', () => {
    expect(spikeShape(row(TILE_AIR, TILE_SPIKE, TILE_AIR), 1, 0)).toBe(
      'SINGLE',
    );
  });

  it('should join a tooth into a strip when another sits on its left', () => {
    expect(spikeShape(row(TILE_SPIKE, TILE_SPIKE, TILE_AIR), 1, 0)).toBe(
      'STRIP',
    );
  });

  it('should join a tooth into a strip when another sits on its right', () => {
    expect(spikeShape(row(TILE_AIR, TILE_SPIKE, TILE_SPIKE), 1, 0)).toBe(
      'STRIP',
    );
  });

  it('should call every tooth a strip when a whole row of them runs together', () => {
    const level = row(TILE_SPIKE, TILE_SPIKE, TILE_SPIKE);

    expect(spikeShape(level, 0, 0)).toBe('STRIP');
    expect(spikeShape(level, 1, 0)).toBe('STRIP');
    expect(spikeShape(level, 2, 0)).toBe('STRIP');
  });

  it('should join ceiling teeth into a strip when they sit beside their own kind', () => {
    expect(
      spikeShape(row(TILE_SPIKE_CEILING, TILE_SPIKE_CEILING, TILE_AIR), 1, 0),
    ).toBe('STRIP');
  });

  it('should leave a tooth on its own when its neighbours hang the other way up', () => {
    expect(
      spikeShape(row(TILE_SPIKE_CEILING, TILE_SPIKE, TILE_SPIKE_CEILING), 1, 0),
    ).toBe('SINGLE');
  });

  it('should find no company when the tooth sits against the left edge of the level', () => {
    expect(spikeShape(row(TILE_SPIKE, TILE_AIR), 0, 0)).toBe('SINGLE');
  });

  it('should find no company when the tooth sits against the right edge of the level', () => {
    expect(spikeShape(row(TILE_AIR, TILE_SPIKE), 1, 0)).toBe('SINGLE');
  });
});
