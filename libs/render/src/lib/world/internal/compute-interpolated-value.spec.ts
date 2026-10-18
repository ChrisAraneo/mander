import { describe, expect, it } from 'vitest';

import { computeInterpolatedValue } from './compute-interpolated-value';

describe('computeInterpolatedValue', () => {
  it('should give the first value when the blend is zero', () => {
    const result = computeInterpolatedValue(10, 20, 0);

    expect(result).toBe(10);
  });

  it('should give the second value when the blend is one', () => {
    const result = computeInterpolatedValue(10, 20, 1);

    expect(result).toBe(20);
  });

  it('should give a value part of the way when the blend is between', () => {
    const result = computeInterpolatedValue(10, 20, 0.25);

    expect(result).toBe(12.5);
  });
});
