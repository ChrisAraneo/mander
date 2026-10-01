import { TILE_SPIKE, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { getSpikeRemovalRate } from './get-spike-removal-rate';

const LEVEL: Tile[][] = [[TILE_SPIKE]];

const getRate = (levelNumber: number) =>
  getSpikeRemovalRate({ tiles: LEVEL, levelNumber }).rate;

describe('getSpikeRemovalRate', () => {
  it('should remove every spike when the level is the first', () => {
    expect(getRate(1)).toBe(1);
  });

  it('should remove fewer spikes when the level is the second through the fourth', () => {
    expect(getRate(2)).toBe(0.8);
    expect(getRate(3)).toBe(0.6);
    expect(getRate(4)).toBe(0.3);
  });

  it('should remove no spikes when the level is the fifth or later', () => {
    expect(getRate(5)).toBe(0);
    expect(getRate(8)).toBe(0);
  });

  it('should keep the grid the same when it reads the level number', () => {
    expect(getSpikeRemovalRate({ tiles: LEVEL, levelNumber: 1 }).tiles).toBe(
      LEVEL,
    );
  });

  it('should pass the level number on when it reads it', () => {
    expect(
      getSpikeRemovalRate({ tiles: LEVEL, levelNumber: 3 }).levelNumber,
    ).toBe(3);
  });
});
