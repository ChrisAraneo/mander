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

import { findSpikeCells } from './find-spike-cells';

const LEVEL: Tile[][] = [
  [TILE_SPIKE_CEILING, TILE_AIR, TILE_SPIKE_FALLING],
  [TILE_AIR, TILE_SPIKE, TILE_DIRT],
];

const RANDOM = createRandom('SEED');

describe('findSpikeCells', () => {
  it('should give the spot of every spike when the grid holds them', () => {
    expect(
      findSpikeCells({ tiles: LEVEL, random: RANDOM, rate: 1 }).cells,
    ).toEqual([
      { row: 0, column: 0 },
      { row: 0, column: 2 },
      { row: 1, column: 1 },
    ]);
  });

  it('should give no spots when the grid holds no spike', () => {
    expect(
      findSpikeCells({ tiles: [[TILE_DIRT]], random: RANDOM, rate: 1 }).cells,
    ).toEqual([]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(
      findSpikeCells({ tiles: [], random: RANDOM, rate: 1 }).cells,
    ).toEqual([]);
  });

  it('should keep the grid the same when it looks for spikes', () => {
    expect(
      findSpikeCells({ tiles: LEVEL, random: RANDOM, rate: 1 }).tiles,
    ).toBe(LEVEL);
  });

  it('should pass the generator on when it looks for spikes', () => {
    expect(
      findSpikeCells({ tiles: LEVEL, random: RANDOM, rate: 1 }).random,
    ).toBe(RANDOM);
  });

  it('should pass the rate on when it looks for spikes', () => {
    expect(
      findSpikeCells({ tiles: LEVEL, random: RANDOM, rate: 0.8 }).rate,
    ).toBe(0.8);
  });
});
