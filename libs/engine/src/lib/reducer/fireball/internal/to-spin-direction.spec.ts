import { describe, expect, it } from 'vitest';

import { toSpinDirection } from './to-spin-direction';

describe('toSpinDirection', () => {
  it('should give minus one when the fireball spins anticlockwise', () => {
    const direction = toSpinDirection('ANTICLOCKWISE');

    expect(direction).toBe(-1);
  });

  it('should give one when the fireball spins clockwise', () => {
    const direction = toSpinDirection('CLOCKWISE');

    expect(direction).toBe(1);
  });
});
