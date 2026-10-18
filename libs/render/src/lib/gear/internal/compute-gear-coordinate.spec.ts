import { describe, expect, it } from 'vitest';

import { computeGearCoordinate } from './compute-gear-coordinate';

describe('computeGearCoordinate', () => {
  it('should give the origin when the fraction is zero', () => {
    const result = computeGearCoordinate(10, 64, 0);

    expect(result).toBe(10);
  });

  it('should give the far edge of the box when the fraction is one', () => {
    const result = computeGearCoordinate(10, 64, 1);

    expect(result).toBe(74);
  });

  it('should give a point part of the way across when the fraction is between', () => {
    const result = computeGearCoordinate(10, 64, 0.25);

    expect(result).toBe(26);
  });
});
