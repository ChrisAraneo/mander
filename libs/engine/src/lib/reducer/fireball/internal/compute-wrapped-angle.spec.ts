import { describe, expect, it } from 'vitest';

import { computeWrappedAngle } from './compute-wrapped-angle';
import { FULL_TURN, GERM_CYCLE_ANGLE } from './consts';

describe('computeWrappedAngle', () => {
  it('should keep the angle when it is already within the germ cycle', () => {
    const angle = computeWrappedAngle(1);

    expect(angle).toBeCloseTo(1, 6);
  });

  it('should keep zero when the angle is zero', () => {
    const angle = computeWrappedAngle(0);

    expect(angle).toBe(0);
  });

  it('should keep the angle past a single turn when the germ is still being drawn', () => {
    const angle = computeWrappedAngle(FULL_TURN + 1);

    expect(angle).toBeCloseTo(FULL_TURN + 1, 6);
  });

  it('should wrap the angle up into the germ cycle when it is negative', () => {
    const angle = computeWrappedAngle(-Math.PI / 2);

    expect(angle).toBeCloseTo(GERM_CYCLE_ANGLE - Math.PI / 2, 6);
  });

  it('should wrap the angle down into the germ cycle when it goes past one', () => {
    const angle = computeWrappedAngle(GERM_CYCLE_ANGLE + Math.PI / 2);

    expect(angle).toBeCloseTo(Math.PI / 2, 6);
  });

  it('should wrap the angle to zero when it is exactly one germ cycle', () => {
    const angle = computeWrappedAngle(GERM_CYCLE_ANGLE);

    expect(angle).toBeCloseTo(0, 6);
  });

  it('should wrap the angle up into the germ cycle when it is more than one below zero', () => {
    const angle = computeWrappedAngle(-(GERM_CYCLE_ANGLE + Math.PI / 2));

    expect(angle).toBeCloseTo(GERM_CYCLE_ANGLE - Math.PI / 2, 6);
  });

  it('should count a whole number of turns in the cycle so it never moves the fireball round its block', () => {
    expect(GERM_CYCLE_ANGLE % FULL_TURN).toBeCloseTo(0, 10);
  });
});
