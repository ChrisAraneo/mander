import { describe, expect, it } from 'vitest';

import { computeFlicker } from './compute-flicker';

describe('computeFlicker', () => {
  it('should keep the flame at full size when the wave is at its middle', () => {
    const flicker = computeFlicker(0, 0);

    expect(flicker).toBe(1);
  });

  it('should swell the flame to its largest when the wave peaks through the angle', () => {
    const flicker = computeFlicker(Math.PI / 2, 0);

    expect(flicker).toBeCloseTo(1.12, 6);
  });

  it('should swell the flame to its largest when the wave peaks through time', () => {
    const flicker = computeFlicker(0, Math.PI / 28);

    expect(flicker).toBeCloseTo(1.12, 6);
  });
});
