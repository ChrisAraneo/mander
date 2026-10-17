import { describe, expect, it } from 'vitest';

import { computeProjectedSpan } from './compute-projected-span';

const POINTS = [
  { x: 3, y: 5 },
  { x: -2, y: 7 },
  { x: 10, y: 1 },
];

describe('computeProjectedSpan', () => {
  it('should give the lowest and highest position of the points when they are projected on a horizontal axis', () => {
    const span = computeProjectedSpan({ normalX: 1, normalY: 0 }, POINTS);

    expect(span).toEqual({ min: -2, max: 10 });
  });

  it('should give the lowest and highest position of the points when they are projected on a slanted axis', () => {
    const span = computeProjectedSpan({ normalX: 1, normalY: 1 }, POINTS);

    expect(span).toEqual({ min: 5, max: 11 });
  });

  it('should give an empty span when there are no points', () => {
    const span = computeProjectedSpan({ normalX: 1, normalY: 0 }, []);

    expect(span).toEqual({ min: Infinity, max: -Infinity });
  });
});
