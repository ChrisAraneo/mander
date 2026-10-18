import { describe, expect, it } from 'vitest';

import { computeClampedIndex } from './compute-clamped-index';

describe('computeClampedIndex', () => {
  it('should keep the index when it is between zero and the edge', () => {
    expect(computeClampedIndex(3, 5)).toBe(3);
  });

  it('should give zero when the index is below zero', () => {
    expect(computeClampedIndex(-4, 5)).toBe(0);
  });

  it('should give the edge when the index is past the edge', () => {
    expect(computeClampedIndex(9, 5)).toBe(5);
  });

  it('should keep the index when it is right on the edge', () => {
    expect(computeClampedIndex(5, 5)).toBe(5);
  });
});
