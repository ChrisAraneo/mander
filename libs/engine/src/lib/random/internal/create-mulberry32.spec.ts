import { describe, expect, it } from 'vitest';

import { createMulberry32 } from './create-mulberry32';

describe('createMulberry32', () => {
  it('should give the same floats in the same order when it is seeded with the same number', () => {
    const roll = createMulberry32(42);

    expect([roll(), roll()]).toEqual([0.6011037519201636, 0.44829055899754167]);
  });

  it('should keep every float between zero and one when it rolls many times', () => {
    const roll = createMulberry32(7);

    const rolls = Array.from({ length: 1000 }, () => roll());

    expect(rolls.every((value) => value >= 0 && value < 1)).toBe(true);
  });
});
