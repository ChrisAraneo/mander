import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeStarArmPoints } from './compute-star-arm-points';

describe('computeStarArmPoints', () => {
  it('should give ten corners starting at the top when it is given a centre and a radius', () => {
    const points = computeStarArmPoints(16, 16, 10);

    expect(size(points)).toBe(10);
    expect(points[0].x).toBeCloseTo(16, 6);
    expect(points[0].y).toBeCloseTo(6, 6);
  });

  it('should pull every second corner in to the waist when it is given a radius', () => {
    const points = computeStarArmPoints(0, 0, 10);

    expect(Math.hypot(points[1].x, points[1].y)).toBeCloseTo(4.4, 6);
    expect(Math.hypot(points[2].x, points[2].y)).toBeCloseTo(10, 6);
  });
});
