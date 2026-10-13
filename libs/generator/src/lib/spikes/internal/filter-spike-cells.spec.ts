import {
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  TILE_SPIKE_FALLING,
  type Tile,
} from '@mander/model';
import { createRandom } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import { filterSpikeCells } from './filter-spike-cells';

const LEVEL: Tile[][] = [
  [TILE_SPIKE_CEILING, TILE_AIR, TILE_SPIKE_FALLING],
  [TILE_AIR, TILE_SPIKE, TILE_DIRT],
];

const RANDOM = createRandom('SEED');

describe('filterSpikeCells', () => {
  it('should give the spot of every spike when the grid holds them', () => {
    expect(
      filterSpikeCells({ tiles: LEVEL, rate: 1, random: RANDOM }).cells,
    ).toEqual([
      { row: 0, column: 0 },
      { row: 0, column: 2 },
      { row: 1, column: 1 },
    ]);
  });

  it('should give no spots when the grid holds no spike', () => {
    expect(
      filterSpikeCells({ tiles: [[TILE_DIRT]], rate: 1, random: RANDOM }).cells,
    ).toEqual([]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(
      filterSpikeCells({ tiles: [], rate: 1, random: RANDOM }).cells,
    ).toEqual([]);
  });

  it('should keep the grid the same when it looks for spikes', () => {
    expect(
      filterSpikeCells({ tiles: LEVEL, rate: 1, random: RANDOM }).tiles,
    ).toBe(LEVEL);
  });

  it('should pass the generator on when it looks for spikes', () => {
    expect(
      filterSpikeCells({ tiles: LEVEL, rate: 1, random: RANDOM }).random,
    ).toBe(RANDOM);
  });

  it('should pass the rate on when it looks for spikes', () => {
    expect(
      filterSpikeCells({ tiles: LEVEL, rate: 0.8, random: RANDOM }).rate,
    ).toBe(0.8);
  });
});
