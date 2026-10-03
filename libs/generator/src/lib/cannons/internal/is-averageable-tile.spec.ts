import {
  TILE_AIR,
  TILE_CANNON,
  TILE_DIRT,
  TILE_GEM,
  TILE_SPIKE,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isAverageableTile } from './is-averageable-tile';

describe('isAverageableTile', () => {
  it('should count the tile when it is a block', () => {
    expect(isAverageableTile(TILE_DIRT)).toBe(true);
  });

  it('should skip the tile when it is empty', () => {
    expect(isAverageableTile(TILE_AIR)).toBe(false);
  });

  it('should skip the tile when it is a pickup', () => {
    expect(isAverageableTile(TILE_GEM)).toBe(false);
  });

  it('should skip the tile when it is a spike', () => {
    expect(isAverageableTile(TILE_SPIKE)).toBe(false);
  });

  it('should skip the tile when it is another cannon', () => {
    expect(isAverageableTile(TILE_CANNON)).toBe(false);
  });

  it('should skip the tile when it is off the grid', () => {
    expect(isAverageableTile(undefined)).toBe(false);
  });
});
