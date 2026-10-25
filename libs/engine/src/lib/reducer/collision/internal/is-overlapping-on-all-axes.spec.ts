import type { Triangle } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computeBoxCorners } from './compute-box-corners';
import { isOverlappingOnAllAxes } from './is-overlapping-on-all-axes';

const TRIANGLE: Triangle = [
  { x: 0, y: 0 },
  { x: 32, y: 0 },
  { x: 0, y: 32 },
];

describe('isOverlappingOnAllAxes', () => {
  it('should overlap when the box corners overlap the triangle on every axis', () => {
    const isOverlapping = isOverlappingOnAllAxes(
      TRIANGLE,
      computeBoxCorners(0, 0, 8, 8),
    );

    expect(isOverlapping).toBe(true);
  });

  it('should not overlap when the box corners lie beyond the slanted edge of the triangle', () => {
    const isOverlapping = isOverlappingOnAllAxes(
      TRIANGLE,
      computeBoxCorners(24, 24, 6, 6),
    );

    expect(isOverlapping).toBe(false);
  });

  it('should not overlap when the box corners are far away from the triangle', () => {
    const isOverlapping = isOverlappingOnAllAxes(
      TRIANGLE,
      computeBoxCorners(200, 200, 8, 8),
    );

    expect(isOverlapping).toBe(false);
  });

  it('should not overlap when there are no box corners', () => {
    const isOverlapping = isOverlappingOnAllAxes(TRIANGLE, []);

    expect(isOverlapping).toBe(false);
  });
});
