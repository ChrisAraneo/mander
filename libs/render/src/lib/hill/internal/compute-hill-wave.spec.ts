import { describe, expect, it } from 'vitest';

import { computeHillWave } from './compute-hill-wave';

describe('computeHillWave', () => {
  it('should give a flat wave when the phase is at its start', () => {
    const result = computeHillWave(0);

    expect(result).toBe(0);
  });

  it('should add the small ripple to the main wave when the phase has moved on', () => {
    const result = computeHillWave(1);

    expect(result).toBeCloseTo(Math.sin(1) + Math.sin(2.3) * 0.4, 10);
  });

  it('should dip below the start when the phase is past half a turn', () => {
    const result = computeHillWave(Math.PI * 1.5);

    expect(result).toBeLessThan(0);
  });
});
