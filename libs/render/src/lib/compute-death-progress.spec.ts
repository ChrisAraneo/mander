import { describe, expect, it } from 'vitest';

import { computeDeathProgress } from './compute-death-progress';

describe('computeDeathProgress', () => {
  it('should report no progress when nothing is dying', () => {
    expect(computeDeathProgress(null, 0.3)).toBe(0);
  });

  it('should report no progress when dying has just begun', () => {
    expect(computeDeathProgress(0, 0.3)).toBe(0);
  });

  it('should report the share of the death played so far when dying is under way', () => {
    expect(computeDeathProgress(0.15, 0.3)).toBeCloseTo(0.5, 6);
  });

  it('should stop at the end when dying has lasted longer than the death', () => {
    expect(computeDeathProgress(0.6, 0.3)).toBe(1);
  });
});
