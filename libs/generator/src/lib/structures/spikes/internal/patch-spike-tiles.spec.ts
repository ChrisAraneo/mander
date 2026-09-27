import { TILE_AIR, TILE_DIRT, TILE_SPIKE, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchSpikeTiles } from './patch-spike-tiles';

const level = (): Tile[][] => [
  [TILE_SPIKE, TILE_SPIKE],
  [TILE_DIRT, TILE_DIRT],
];

describe('patchSpikeTiles', () => {
  it('should pull the spikes out when it gets marks', () => {
    expect(
      patchSpikeTiles({
        tiles: level(),
        patches: [{ row: 0, column: 1, tile: TILE_AIR }],
      }),
    ).toEqual([
      [TILE_SPIKE, TILE_AIR],
      [TILE_DIRT, TILE_DIRT],
    ]);
  });

  it('should give back the same grid when it gets no marks', () => {
    expect(patchSpikeTiles({ tiles: level(), patches: [] })).toEqual(level());
  });

  it('should not change the old grid when it pulls a spike', () => {
    const tiles = level();

    patchSpikeTiles({
      tiles,
      patches: [{ row: 0, column: 0, tile: TILE_AIR }],
    });

    expect(tiles).toEqual(level());
  });
});
