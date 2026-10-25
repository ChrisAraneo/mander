import { describe, expect, it } from 'vitest';

import { BULLET_CLUSTERS, HEART_CLUSTERS, STAR_CLUSTERS } from './consts';
import { findItemCluster } from './find-item-cluster';

describe('findItemCluster', () => {
  it('should give the cluster for the count when the count has its own cluster', () => {
    const result = findItemCluster(HEART_CLUSTERS, 1);

    expect(result).toEqual({ scale: 1, spots: [{ x: 0.5, y: 0.46 }] });
  });

  it('should give the cluster the count rounds to when the count is fractional', () => {
    const result = findItemCluster(HEART_CLUSTERS, 2.4).scale;

    expect(result).toBe(0.66);
  });

  it('should give the largest cluster when the count is above every cluster', () => {
    const result = findItemCluster(STAR_CLUSTERS, 5).scale;

    expect(result).toBe(0.24);
  });

  it('should give the smallest cluster when the count is zero', () => {
    const result = findItemCluster(STAR_CLUSTERS, 0).scale;

    expect(result).toBe(0.42);
  });

  it('should give the largest cluster that fits when the count falls between two clusters', () => {
    const result = findItemCluster(BULLET_CLUSTERS, 5).scale;

    expect(result).toBe(0.15);
  });

  it('should give the cluster of six when the count is seven', () => {
    const result = findItemCluster(BULLET_CLUSTERS, 7).scale;

    expect(result).toBe(0.13);
  });
});
