import type { Triangle } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import { computeBoxCorners } from './compute-box-corners';
import { isOverlappingOnAxis } from './is-overlapping-on-axis';

const TRIANGLE: Triangle = [
  { x: 0, y: 0 },
  { x: 32, y: 0 },
  { x: 0, y: 32 },
];

const HORIZONTAL_AXIS = { normalX: 1, normalY: 0 };

describe('isOverlappingOnAxis', () => {
  it('should overlap when the box and the triangle share some of the axis', () => {
    const isOverlapping = isOverlappingOnAxis(
      HORIZONTAL_AXIS,
      TRIANGLE,
      computeBoxCorners(10, 10, 8, 8),
    );

    expect(isOverlapping).toBe(true);
  });

  it('should not overlap when the box lies past the triangle on the axis', () => {
    const isOverlapping = isOverlappingOnAxis(
      HORIZONTAL_AXIS,
      TRIANGLE,
      computeBoxCorners(40, 10, 8, 8),
    );

    expect(isOverlapping).toBe(false);
  });

  it('should not overlap when the box only touches the triangle on the axis', () => {
    const isOverlapping = isOverlappingOnAxis(
      HORIZONTAL_AXIS,
      TRIANGLE,
      computeBoxCorners(32, 10, 8, 8),
    );

    expect(isOverlapping).toBe(false);
  });

  it('should not overlap when the box lies beyond the slanted edge of the triangle', () => {
    const isOverlapping = isOverlappingOnAxis(
      { normalX: 32, normalY: 32 },
      TRIANGLE,
      computeBoxCorners(24, 24, 6, 6),
    );

    expect(isOverlapping).toBe(false);
  });
});
