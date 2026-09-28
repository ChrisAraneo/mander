import { describe, expect, it } from 'vitest';

import { clampIndex } from './clamp-index';

describe('clampIndex', () => {
  it('should keep the index when it is between zero and the edge', () => {
    expect(clampIndex(3, 5)).toBe(3);
  });

  it('should give zero when the index is below zero', () => {
    expect(clampIndex(-4, 5)).toBe(0);
  });

  it('should give the edge when the index is past the edge', () => {
    expect(clampIndex(9, 5)).toBe(5);
  });

  it('should keep the index when it is right on the edge', () => {
    expect(clampIndex(5, 5)).toBe(5);
  });
});
