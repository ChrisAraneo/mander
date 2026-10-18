import { describe, expect, it } from 'vitest';

import { computeVelocityFacing } from './compute-velocity-facing';

describe('computeVelocityFacing', () => {
  it('should face forwards when it moves to the right', () => {
    expect(computeVelocityFacing(120)).toBe(1);
  });

  it('should face backwards when it moves to the left', () => {
    expect(computeVelocityFacing(-120)).toBe(-1);
  });

  it('should face forwards when it stands still', () => {
    expect(computeVelocityFacing(0)).toBe(1);
  });
});
