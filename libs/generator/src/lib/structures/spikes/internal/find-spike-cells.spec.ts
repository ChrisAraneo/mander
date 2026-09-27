import {
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  TILE_SPIKE_FALLING,
  type Tile,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { findSpikeCells } from './find-spike-cells';

const LEVEL: Tile[][] = [
  [TILE_SPIKE_CEILING, TILE_AIR, TILE_SPIKE_FALLING],
  [TILE_AIR, TILE_SPIKE, TILE_DIRT],
];

describe('findSpikeCells', () => {
  it('should give the spot of every spike when the grid holds them', () => {
    expect(
      findSpikeCells({ tiles: LEVEL, levelNumber: 1, rate: 1 }).cells,
    ).toEqual([
      { row: 0, column: 0 },
      { row: 0, column: 2 },
      { row: 1, column: 1 },
    ]);
  });

  it('should give no spots when the grid holds no spike', () => {
    expect(
      findSpikeCells({ tiles: [[TILE_DIRT]], levelNumber: 1, rate: 1 }).cells,
    ).toEqual([]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(
      findSpikeCells({ tiles: [], levelNumber: 1, rate: 1 }).cells,
    ).toEqual([]);
  });

  it('should keep the grid the same when it looks for spikes', () => {
    expect(
      findSpikeCells({ tiles: LEVEL, levelNumber: 1, rate: 1 }).tiles,
    ).toBe(LEVEL);
  });

  it('should pass the level number and rate on when it looks for spikes', () => {
    const found = findSpikeCells({ tiles: LEVEL, levelNumber: 2, rate: 0.8 });

    expect([found.levelNumber, found.rate]).toEqual([2, 0.8]);
  });
});
