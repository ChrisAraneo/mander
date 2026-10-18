import { describe, expect, it } from 'vitest';

import { computeBoxCorners } from './compute-box-corners';

describe('computeBoxCorners', () => {
  it('should give the top-left, top-right, bottom-right and bottom-left corners when it is given a box', () => {
    const corners = computeBoxCorners(10, 20, 30, 40);

    expect(corners).toEqual([
      { x: 10, y: 20 },
      { x: 40, y: 20 },
      { x: 40, y: 60 },
      { x: 10, y: 60 },
    ]);
  });
});
