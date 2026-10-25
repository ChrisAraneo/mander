import { describe, expect, it } from 'vitest';

import { computeStarReachPoint } from './compute-star-reach-point';

describe('computeStarReachPoint', () => {
  it('should put the point to the right of the centre when the angle is zero', () => {
    const point = computeStarReachPoint(16, 16, 0, 10);

    expect(point.x).toBeCloseTo(26, 6);
    expect(point.y).toBeCloseTo(16, 6);
  });

  it('should put the point below the centre when the angle is a quarter turn', () => {
    const point = computeStarReachPoint(16, 16, Math.PI / 2, 10);

    expect(point.x).toBeCloseTo(16, 6);
    expect(point.y).toBeCloseTo(26, 6);
  });

  it('should put the point on the centre when the reach is zero', () => {
    const point = computeStarReachPoint(16, 16, 1, 0);

    expect(point.x).toBeCloseTo(16, 6);
    expect(point.y).toBeCloseTo(16, 6);
  });
});
