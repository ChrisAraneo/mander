import type { Triangle } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isBoxHittingTriangle } from './is-box-hitting-triangle';

const TRIANGLE: Triangle = [
  { x: 0, y: 0 },
  { x: 32, y: 0 },
  { x: 0, y: 32 },
];

describe('isBoxHittingTriangle', () => {
  it('should hit when the box overlaps the triangle', () => {
    const isHitting = isBoxHittingTriangle(0, 0, 8, 8, TRIANGLE);

    expect(isHitting).toBe(true);
  });

  it('should miss when the box sits inside the corner of the triangle but beyond its slanted edge', () => {
    const isHitting = isBoxHittingTriangle(24, 24, 6, 6, TRIANGLE);

    expect(isHitting).toBe(false);
  });

  it('should miss when the box is far away from the triangle', () => {
    const isHitting = isBoxHittingTriangle(200, 200, 8, 8, TRIANGLE);

    expect(isHitting).toBe(false);
  });

  it('should miss when the box only touches a corner of the triangle', () => {
    const isHitting = isBoxHittingTriangle(32, 0, 8, 8, TRIANGLE);

    expect(isHitting).toBe(false);
  });
});
