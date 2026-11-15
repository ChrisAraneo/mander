import { describe, expect, it } from 'vitest';

import { FULL_TURN, PINKBALL_CYCLE_ANGLE, QUARTER_TURN } from '../consts';
import { computeWrappedAngle } from './compute-wrapped-angle';

const PRECISION = 6;

const CLOSE_PRECISION = 10;

const PART_WAY_ANGLE = 1;

describe('computeWrappedAngle', () => {
  it('should keep the angle when it is already within the pinkball cycle', () => {
    const angle = computeWrappedAngle(PART_WAY_ANGLE);

    expect(angle).toBeCloseTo(PART_WAY_ANGLE, PRECISION);
  });

  it('should keep zero when the angle is zero', () => {
    const angle = computeWrappedAngle(0);

    expect(angle).toBe(0);
  });

  it('should keep the angle past a single turn when the ball is part way through its cycle', () => {
    const angle = computeWrappedAngle(FULL_TURN + PART_WAY_ANGLE);

    expect(angle).toBeCloseTo(FULL_TURN + PART_WAY_ANGLE, PRECISION);
  });

  it('should wrap the angle up into the pinkball cycle when it is negative', () => {
    const angle = computeWrappedAngle(-QUARTER_TURN);

    expect(angle).toBeCloseTo(PINKBALL_CYCLE_ANGLE - QUARTER_TURN, PRECISION);
  });

  it('should wrap the angle down into the pinkball cycle when it goes past one', () => {
    const angle = computeWrappedAngle(PINKBALL_CYCLE_ANGLE + QUARTER_TURN);

    expect(angle).toBeCloseTo(QUARTER_TURN, PRECISION);
  });

  it('should wrap the angle to zero when it is exactly one pinkball cycle', () => {
    const angle = computeWrappedAngle(PINKBALL_CYCLE_ANGLE);

    expect(angle).toBeCloseTo(0, PRECISION);
  });

  it('should wrap the angle up into the pinkball cycle when it is more than one below zero', () => {
    const angle = computeWrappedAngle(-(PINKBALL_CYCLE_ANGLE + QUARTER_TURN));

    expect(angle).toBeCloseTo(PINKBALL_CYCLE_ANGLE - QUARTER_TURN, PRECISION);
  });

  it('should fit a whole number of turns into the cycle when the ball returns to its block', () => {
    expect(PINKBALL_CYCLE_ANGLE % FULL_TURN).toBeCloseTo(0, CLOSE_PRECISION);
  });
});
