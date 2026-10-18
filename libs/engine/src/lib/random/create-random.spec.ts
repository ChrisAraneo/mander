import { describe, expect, it } from 'vitest';

import { createRandom } from './create-random';

describe('createRandom', () => {
  it('should roll the same sequence when it is seeded with the same text', () => {
    const first = createRandom('mander');
    const second = createRandom('mander');

    expect([first.rollFloat(), first.rollInt(1, 6)]).toEqual([
      second.rollFloat(),
      second.rollInt(1, 6),
    ]);
  });

  it('should roll the recorded values when it is seeded with mander', () => {
    const random = createRandom('mander');

    expect([
      random.rollFloat(),
      random.rollInt(1, 6),
      random.isRollUnder(0.5),
      random.pick(['a', 'b', 'c']),
    ]).toEqual([0.4134875510353595, 5, true, 'a']);
  });

  it('should keep whole numbers within the bounds when it rolls many times', () => {
    const random = createRandom('bounds');

    const rolls = Array.from({ length: 1000 }, () => random.rollInt(3, 5));

    expect(new Set(rolls)).toEqual(new Set([3, 4, 5]));
  });

  it('should never roll under when the probability is zero', () => {
    const random = createRandom('never');

    const rolls = Array.from({ length: 100 }, () => random.isRollUnder(0));

    expect(rolls.includes(true)).toBe(false);
  });
});
