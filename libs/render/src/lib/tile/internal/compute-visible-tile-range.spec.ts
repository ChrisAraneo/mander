import { describe, expect, it } from 'vitest';

import { computeVisibleTileRange } from './compute-visible-tile-range';

describe('computeVisibleTileRange', () => {
  it('should take one tile beyond each edge of the view when the camera is inside the level', () => {
    const result = computeVisibleTileRange(64, 96, 20);

    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should start at the first tile when the camera is at the start', () => {
    const result = computeVisibleTileRange(0, 64, 20);

    expect(result).toEqual([0, 1, 2, 3]);
  });

  it('should stop at the last tile when the view reaches past the end', () => {
    const result = computeVisibleTileRange(500, 96, 17);

    expect(result).toEqual([14, 15, 16, 17]);
  });
});
