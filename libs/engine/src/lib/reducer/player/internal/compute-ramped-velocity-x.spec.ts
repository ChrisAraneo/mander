import { describe, expect, it } from 'vitest';

import { computeRampedVelocityX } from './compute-ramped-velocity-x';

describe('computeRampedVelocityX', () => {
  it('should creep towards the target speed when the target lies further than one step away', () => {
    expect(computeRampedVelocityX(0, 210, 3.5)).toBe(3.5);
  });

  it('should creep back towards a standstill when the key is let go', () => {
    expect(computeRampedVelocityX(210, 0, 3.5)).toBe(206.5);
  });

  it('should creep towards the target speed when the player runs left', () => {
    expect(computeRampedVelocityX(0, -210, 3.5)).toBe(-3.5);
  });

  it('should settle on the target speed when the target lies within one step', () => {
    expect(computeRampedVelocityX(208, 210, 3.5)).toBe(210);
  });

  it('should settle on a standstill when the standstill lies within one step', () => {
    expect(computeRampedVelocityX(-2, 0, 3.5)).toBe(0);
  });

  it('should keep the speed when the player already runs at the target speed', () => {
    expect(computeRampedVelocityX(210, 210, 3.5)).toBe(210);
  });

  it('should turn the player around over two stretches when they reverse at full speed', () => {
    expect(computeRampedVelocityX(210, -210, 3.5)).toBe(206.5);
  });
});
