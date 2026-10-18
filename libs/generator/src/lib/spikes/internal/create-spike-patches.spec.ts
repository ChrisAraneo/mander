import { TILE_AIR, TILE_SPIKE, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createSpikePatches } from './create-spike-patches';

const LEVEL: Tile[][] = [[TILE_SPIKE, TILE_SPIKE]];

describe('createSpikePatches', () => {
  it('should mark the spots with air when it gets spots', () => {
    expect(
      createSpikePatches({
        tiles: LEVEL,
        cells: [
          { row: 0, column: 0 },
          { row: 0, column: 1 },
        ],
      }).patches,
    ).toEqual([
      { row: 0, column: 0, tile: TILE_AIR },
      { row: 0, column: 1, tile: TILE_AIR },
    ]);
  });

  it('should make no marks when it gets no spots', () => {
    expect(createSpikePatches({ tiles: LEVEL, cells: [] }).patches).toEqual([]);
  });

  it('should keep the grid the same when it makes the marks', () => {
    expect(createSpikePatches({ tiles: LEVEL, cells: [] }).tiles).toBe(LEVEL);
  });
});
