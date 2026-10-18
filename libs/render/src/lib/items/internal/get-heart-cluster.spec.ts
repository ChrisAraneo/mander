import { describe, expect, it } from 'vitest';

import { getHeartCluster } from './get-heart-cluster';

describe('getHeartCluster', () => {
  it('should give one big heart when the count is one', () => {
    const result = getHeartCluster(1);

    expect(result).toEqual({ lobe: 1, spots: [{ x: 0.5, y: 0.46 }] });
  });

  it('should give the cluster of two when the count rounds to two', () => {
    const result = getHeartCluster(2.4).lobe;

    expect(result).toBe(0.66);
  });

  it('should give no more than three hearts when the count is larger', () => {
    const result = getHeartCluster(7).lobe;

    expect(result).toBe(0.58);
  });

  it('should give at least one heart when the count is zero', () => {
    const result = getHeartCluster(0).lobe;

    expect(result).toBe(1);
  });
});
