import { every, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createMulberry32 } from './create-mulberry32';

describe('createMulberry32', () => {
  it('should give the same floats in the same order when it is seeded with the same number', () => {
    const random = createMulberry32(42);

    expect([random(), random()]).toEqual([
      0.6011037519201636, 0.44829055899754167,
    ]);
  });

  it('should give other floats when it is seeded with another number', () => {
    const random = createMulberry32(43);

    expect([random(), random()]).not.toEqual([
      0.6011037519201636, 0.44829055899754167,
    ]);
  });

  it('should keep every float between zero and one when it rolls many times', () => {
    const random = createMulberry32(7);

    const rolls = times(1000, () => random());

    expect(every(rolls, (value) => value >= 0 && value < 1)).toBe(true);
  });
});
