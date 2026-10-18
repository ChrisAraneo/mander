import { describe, expect, it } from 'vitest';

import { computeStarArmPoint } from './compute-star-arm-point';

describe('computeStarArmPoint', () => {
  it('should put the first corner straight above the centre when it is given index zero', () => {
    const point = computeStarArmPoint(16, 16, 10, 0);

    expect(point.x).toBeCloseTo(16, 6);
    expect(point.y).toBeCloseTo(6, 6);
  });

  it('should pull the corner in to the waist when it is given an odd index', () => {
    const point = computeStarArmPoint(0, 0, 10, 1);

    expect(point.x).toBeCloseTo(Math.cos(-Math.PI / 2 + Math.PI / 5) * 4.4, 6);
    expect(point.y).toBeCloseTo(Math.sin(-Math.PI / 2 + Math.PI / 5) * 4.4, 6);
  });

  it('should reach out to the full radius when it is given an even index', () => {
    const point = computeStarArmPoint(0, 0, 10, 2);

    expect(Math.hypot(point.x, point.y)).toBeCloseTo(10, 6);
  });
});
