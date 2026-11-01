import { describe, expect, it } from 'vitest';

import { computeWrappedAngle } from './compute-wrapped-angle';
import { FULL_TURN, SPIRAL_CYCLE_ANGLE } from './consts';

describe('computeWrappedAngle', () => {
  it('should keep the angle when it is already within the spiral cycle', () => {
    const angle = computeWrappedAngle(1);

    expect(angle).toBeCloseTo(1, 6);
  });

  it('should keep zero when the angle is zero', () => {
    const angle = computeWrappedAngle(0);

    expect(angle).toBe(0);
  });

  it('should keep the angle past a single turn when the spiral is still winding', () => {
    const angle = computeWrappedAngle(FULL_TURN + 1);

    expect(angle).toBeCloseTo(FULL_TURN + 1, 6);
  });

  it('should wrap the angle up into the spiral cycle when it is negative', () => {
    const angle = computeWrappedAngle(-Math.PI / 2);

    expect(angle).toBeCloseTo(SPIRAL_CYCLE_ANGLE - Math.PI / 2, 6);
  });

  it('should wrap the angle down into the spiral cycle when it goes past one', () => {
    const angle = computeWrappedAngle(SPIRAL_CYCLE_ANGLE + Math.PI / 2);

    expect(angle).toBeCloseTo(Math.PI / 2, 6);
  });

  it('should wrap the angle to zero when it is exactly one spiral cycle', () => {
    const angle = computeWrappedAngle(SPIRAL_CYCLE_ANGLE);

    expect(angle).toBeCloseTo(0, 6);
  });

  it('should wrap the angle up into the spiral cycle when it is more than one below zero', () => {
    const angle = computeWrappedAngle(-(SPIRAL_CYCLE_ANGLE + Math.PI / 2));

    expect(angle).toBeCloseTo(SPIRAL_CYCLE_ANGLE - Math.PI / 2, 6);
  });

  it('should count a whole number of turns in the cycle so it never moves the ball round its block', () => {
    expect(SPIRAL_CYCLE_ANGLE % FULL_TURN).toBeCloseTo(0, 10);
  });
});
