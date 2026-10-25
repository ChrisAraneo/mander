import { FIXED_STEP_MS } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { toPulse } from './to-pulse';

describe('toPulse', () => {
  it('should keep the steps of the carry when it makes a pulse', () => {
    expect(toPulse({ carryMs: 0, steps: 3 }).steps).toBe(3);
  });

  it('should say how far into the next step the carried time reaches', () => {
    expect(toPulse({ carryMs: FIXED_STEP_MS / 4, steps: 0 }).alpha).toBeCloseTo(
      0.25,
    );
  });

  it('should give a still pulse when nothing is carried', () => {
    expect(toPulse({ carryMs: 0, steps: 0 })).toEqual({ steps: 0, alpha: 0 });
  });
});
