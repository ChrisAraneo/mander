import { describe, expect, it } from 'vitest';

import { getBulletCluster } from './get-bullet-cluster';

describe('getBulletCluster', () => {
  it('should give one bullet when the count is one', () => {
    const result = getBulletCluster(1).radius;

    expect(result).toBe(0.22);
  });

  it('should give the cluster of two when the count is two', () => {
    const result = getBulletCluster(2).radius;

    expect(result).toBe(0.19);
  });

  it('should give the largest cluster that fits when the count falls between two clusters', () => {
    const result = getBulletCluster(5).radius;

    expect(result).toBe(0.15);
  });

  it('should give the cluster of six when the count is seven', () => {
    const result = getBulletCluster(7).radius;

    expect(result).toBe(0.13);
  });

  it('should give the rain of nine when the count is very large', () => {
    const result = getBulletCluster(9999).radius;

    expect(result).toBe(0.1);
  });

  it('should give one bullet when the count is zero', () => {
    const result = getBulletCluster(0).radius;

    expect(result).toBe(0.22);
  });
});
