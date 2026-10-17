import type { Triangle } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import { computeEdgeAxes } from './compute-edge-axes';

const TRIANGLE: Triangle = [
  { x: 0, y: 0 },
  { x: 10, y: 2 },
  { x: 4, y: 8 },
];

describe('computeEdgeAxes', () => {
  it('should give the normal of each edge in turn, wrapping from the last corner to the first, when it is given a triangle', () => {
    const axes = computeEdgeAxes(TRIANGLE);

    expect(axes).toEqual([
      { normalX: -2, normalY: 10 },
      { normalX: -6, normalY: -6 },
      { normalX: 8, normalY: -4 },
    ]);
  });
});
