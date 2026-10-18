import { describe, expect, it } from 'vitest';

import { computeWrappedAngle } from './compute-wrapped-angle';

describe('computeWrappedAngle', () => {
  it('should keep the angle when it is already within one turn', () => {
    const angle = computeWrappedAngle(1);

    expect(angle).toBeCloseTo(1, 6);
  });

  it('should keep zero when the angle is zero', () => {
    const angle = computeWrappedAngle(0);

    expect(angle).toBe(0);
  });

  it('should wrap the angle up into one turn when it is negative', () => {
    const angle = computeWrappedAngle(-Math.PI / 2);

    expect(angle).toBeCloseTo((3 * Math.PI) / 2, 6);
  });

  it('should wrap the angle down into one turn when it goes past a full turn', () => {
    const angle = computeWrappedAngle((5 * Math.PI) / 2);

    expect(angle).toBeCloseTo(Math.PI / 2, 6);
  });

  it('should wrap the angle to zero when it is exactly one full turn', () => {
    const angle = computeWrappedAngle(Math.PI * 2);

    expect(angle).toBeCloseTo(0, 6);
  });

  it('should wrap the angle up into one turn when it is more than a full turn below zero', () => {
    const angle = computeWrappedAngle(-(5 * Math.PI) / 2);

    expect(angle).toBeCloseTo((3 * Math.PI) / 2, 6);
  });
});
