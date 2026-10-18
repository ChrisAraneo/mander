import { describe, expect, it } from 'vitest';

import { HILL_LAYERS } from '../consts';
import { computeHillPoint } from './compute-hill-point';

describe('computeHillPoint', () => {
  it('should put the point on the baseline when the wave is at its start', () => {
    const point = computeHillPoint(0, 0, HILL_LAYERS[0], 100);

    expect(point.x).toBe(0);
    expect(point.y).toBeCloseTo(100, 6);
  });

  it('should lift the point by the two waves when the screen and camera have moved', () => {
    const point = computeHillPoint(32, 100, HILL_LAYERS[1], 80);
    const phase = (32 + 100 * HILL_LAYERS[1].parallax) / 210;

    expect(point.x).toBe(32);
    expect(point.y).toBeCloseTo(
      80 -
        (Math.sin(phase) + Math.sin(phase * 2.3) * 0.4) *
          HILL_LAYERS[1].amplitude,
      6,
    );
  });
});
