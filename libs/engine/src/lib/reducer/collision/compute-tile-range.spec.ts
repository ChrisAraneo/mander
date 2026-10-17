import { describe, expect, it } from 'vitest';

import { computeTileRange } from './compute-tile-range';

describe('computeTileRange', () => {
  it('should give the one tile when the span sits inside it', () => {
    const range = computeTileRange(40, 10);

    expect(range).toEqual([1]);
  });

  it('should give both tiles when the span crosses a tile edge', () => {
    const range = computeTileRange(20, 20);

    expect(range).toEqual([0, 1]);
  });

  it('should leave out the next tile when the span ends exactly on a tile edge', () => {
    const range = computeTileRange(0, 32);

    expect(range).toEqual([0]);
  });

  it('should give negative tiles when the span lies left of or above the level', () => {
    const range = computeTileRange(-40, 10);

    expect(range).toEqual([-2, -1]);
  });

  it('should give no tile when an empty span starts on a tile edge', () => {
    const range = computeTileRange(32, 0);

    expect(range).toEqual([]);
  });
});
