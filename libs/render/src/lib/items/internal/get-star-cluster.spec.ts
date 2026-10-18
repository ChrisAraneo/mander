import { describe, expect, it } from 'vitest';

import { getStarCluster } from './get-star-cluster';

describe('getStarCluster', () => {
  it('should give one big star when the count is one', () => {
    const result = getStarCluster(1).radius;

    expect(result).toBe(0.42);
  });

  it('should give three stars when the count is three', () => {
    const result = getStarCluster(3).radius;

    expect(result).toBe(0.24);
  });

  it('should give no more than three stars when the count is larger', () => {
    const result = getStarCluster(5).radius;

    expect(result).toBe(0.24);
  });

  it('should give at least one star when the count is zero', () => {
    const result = getStarCluster(0).radius;

    expect(result).toBe(0.42);
  });
});
