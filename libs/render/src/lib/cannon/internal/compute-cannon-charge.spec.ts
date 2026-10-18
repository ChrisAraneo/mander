import type { Cannon } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computeCannonCharge } from './compute-cannon-charge';

const createTestCannon = (reload: number): Cannon => ({
  position: { x: 0, y: 0 },
  timers: { reload },
  statuses: { isFacingRight: true },
});

describe('computeCannonCharge', () => {
  it('should be fully charged when the reload has run out', () => {
    const result = computeCannonCharge(createTestCannon(0));

    expect(result).toBe(1);
  });

  it('should be half charged when half the charge time is left', () => {
    const result = computeCannonCharge(createTestCannon(0.35));

    expect(result).toBeCloseTo(0.5, 6);
  });

  it('should not be charged at all when the whole charge time is left', () => {
    const result = computeCannonCharge(createTestCannon(0.7));

    expect(result).toBe(0);
  });

  it('should not go below empty when the reload is longer than the charge time', () => {
    const result = computeCannonCharge(createTestCannon(3));

    expect(result).toBe(0);
  });
});
