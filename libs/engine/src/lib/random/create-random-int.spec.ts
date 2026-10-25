import { constant, sortBy, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRandom } from './create-random';
import { createRandomInt } from './create-random-int';

describe('createRandomInt', () => {
  it('should give the lowest number when the roll is zero', () => {
    expect(createRandomInt(3, 5, constant(0))).toBe(3);
  });

  it('should give the highest number when the roll is just under one', () => {
    expect(createRandomInt(3, 5, constant(0.9999))).toBe(5);
  });

  it('should keep whole numbers within the bounds when it rolls many times', () => {
    const random = createRandom('bounds');

    const rolls = times(1000, () => createRandomInt(3, 5, random));

    expect(sortBy(uniq(rolls))).toEqual([3, 4, 5]);
  });

  it('should give the same numbers when it is seeded with the same text', () => {
    const first = createRandom('mander');
    const second = createRandom('mander');

    expect(times(5, () => createRandomInt(1, 6, first))).toEqual(
      times(5, () => createRandomInt(1, 6, second)),
    );
  });

  it('should give other numbers when it is seeded with other text', () => {
    const first = createRandom('mander');
    const second = createRandom('Mander');

    expect(times(5, () => createRandomInt(1, 6, first))).not.toEqual(
      times(5, () => createRandomInt(1, 6, second)),
    );
  });
});
