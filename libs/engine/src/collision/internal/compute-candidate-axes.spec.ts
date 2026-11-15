import type { Triangle } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computeCandidateAxes } from './compute-candidate-axes';

const TRIANGLE: Triangle = [
  { x: 0, y: 0 },
  { x: 32, y: 0 },
  { x: 0, y: 32 },
];

describe('computeCandidateAxes', () => {
  it('should give the two box axes followed by the three edge normals when it is given a triangle', () => {
    const axes = computeCandidateAxes(TRIANGLE);

    expect(axes).toEqual([
      { normalX: 1, normalY: 0 },
      { normalX: 0, normalY: 1 },
      { normalX: 0, normalY: 32 },
      { normalX: -32, normalY: -32 },
      { normalX: 32, normalY: 0 },
    ]);
  });
});
