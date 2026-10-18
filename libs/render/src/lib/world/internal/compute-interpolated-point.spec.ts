import { describe, expect, it } from 'vitest';

import { computeInterpolatedPoint } from './compute-interpolated-point';

describe('computeInterpolatedPoint', () => {
  it('should place the point between the two when they are close', () => {
    const result = computeInterpolatedPoint(
      { x: 0, y: 0 },
      { x: 10, y: 20 },
      0.5,
    );

    expect(result).toEqual({ x: 5, y: 10 });
  });

  it('should jump to the new point when the two are more than two tiles apart', () => {
    const to = { x: 100, y: 0 };

    const result = computeInterpolatedPoint({ x: 0, y: 0 }, to, 0.5);

    expect(result).toBe(to);
  });
});
