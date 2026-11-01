import { every, map, round, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeOrbitSpiral } from './compute-orbit-spiral';
import { SPIRAL_ARM_ANGLE, SPIRAL_CYCLE_ANGLE } from './consts';

describe('computeOrbitSpiral', () => {
  it('should hold the ball out at the full reach when the spiral starts', () => {
    expect(computeOrbitSpiral(0)).toBe(0);
  });

  it('should wind the ball all the way in when it has turned one arm of the spiral', () => {
    expect(computeOrbitSpiral(SPIRAL_ARM_ANGLE)).toBeCloseTo(1, 10);
  });

  it('should wind the ball back out when it has turned the whole cycle', () => {
    expect(computeOrbitSpiral(SPIRAL_CYCLE_ANGLE)).toBeCloseTo(0, 10);
  });

  it('should draw the ball in at an even pace when it winds inwards', () => {
    expect(
      map(times(5), (step) =>
        round(computeOrbitSpiral((step * SPIRAL_ARM_ANGLE) / 4), 6),
      ),
    ).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it('should let the ball out at the same pace when it winds back outwards', () => {
    expect(
      map(times(5), (step) =>
        round(
          computeOrbitSpiral(SPIRAL_ARM_ANGLE + (step * SPIRAL_ARM_ANGLE) / 4),
          6,
        ),
      ),
    ).toEqual([1, 0.75, 0.5, 0.25, 0]);
  });

  it('should pick the spiral up where it left off when the angle runs past the cycle', () => {
    expect(
      computeOrbitSpiral(SPIRAL_CYCLE_ANGLE + SPIRAL_ARM_ANGLE),
    ).toBeCloseTo(computeOrbitSpiral(SPIRAL_ARM_ANGLE), 10);
  });

  it('should keep the spiral between the two reaches whatever the angle is', () => {
    expect(
      every(
        times(720, (step) => computeOrbitSpiral((step * Math.PI) / 180)),
        (sweep) => sweep >= 0 && sweep <= 1,
      ),
    ).toBe(true);
  });
});
