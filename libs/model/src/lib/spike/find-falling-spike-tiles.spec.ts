import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_DIRT } from '../blocks/dirt';
import type { Level } from '../level/level';
import type { Tile } from '../tile/tile';
import { findFallingSpikeTiles } from './find-falling-spike-tiles';
import { TILE_SPIKE, TILE_SPIKE_CEILING, TILE_SPIKE_FALLING } from './spike';

const level = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: tiles[0].length,
  height: tiles.length,
  tiles,
  chestItems: [],
});

describe('findFallingSpikeTiles', () => {
  it('should return the position of every falling spike when the level has some', () => {
    expect(
      findFallingSpikeTiles(
        level([
          [TILE_AIR, TILE_SPIKE_FALLING, TILE_AIR],
          [TILE_AIR, TILE_AIR, TILE_AIR],
          [TILE_SPIKE_FALLING, TILE_AIR, TILE_DIRT],
        ]),
      ),
    ).toEqual([
      { x: 1, y: 0 },
      { x: 0, y: 2 },
    ]);
  });

  it('should return the positions in reading order when the level is full of them', () => {
    expect(
      findFallingSpikeTiles(
        level([
          [TILE_SPIKE_FALLING, TILE_SPIKE_FALLING],
          [TILE_SPIKE_FALLING, TILE_SPIKE_FALLING],
        ]),
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]);
  });

  it('should ignore floor and ceiling spikes when the level mixes the spike kinds', () => {
    expect(
      findFallingSpikeTiles(
        level([
          [TILE_SPIKE_CEILING, TILE_SPIKE_FALLING, TILE_SPIKE_CEILING],
          [TILE_AIR, TILE_AIR, TILE_AIR],
          [TILE_SPIKE, TILE_SPIKE, TILE_SPIKE],
        ]),
      ),
    ).toEqual([{ x: 1, y: 0 }]);
  });

  it('should return nothing when the level has no falling spikes', () => {
    expect(
      findFallingSpikeTiles(
        level([
          [TILE_AIR, TILE_SPIKE],
          [TILE_DIRT, TILE_SPIKE_CEILING],
        ]),
      ),
    ).toEqual([]);
  });

  it('should ignore the spikes outside the level when the rows run past the width and height', () => {
    expect(
      findFallingSpikeTiles({
        seed: 'SEED',
        width: 1,
        height: 1,
        tiles: [
          [TILE_SPIKE_FALLING, TILE_SPIKE_FALLING],
          [TILE_SPIKE_FALLING, TILE_SPIKE_FALLING],
        ],
        chestItems: [],
      }),
    ).toEqual([{ x: 0, y: 0 }]);
  });
});
