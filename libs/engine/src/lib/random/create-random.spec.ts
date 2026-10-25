import { every, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRandom } from './create-random';
import { createRandomInt } from './create-random-int';
import { isRollUnder } from './is-roll-under';
import { takeRandom } from './take-random';

describe('createRandom', () => {
  it('should roll the same sequence when it is seeded with the same text', () => {
    const first = createRandom('mander');
    const second = createRandom('mander');

    expect(times(4, () => first())).toEqual(times(4, () => second()));
  });

  it('should roll a different sequence when it is seeded with other text', () => {
    const first = createRandom('mander');
    const second = createRandom('Mander');

    expect(times(4, () => first())).not.toEqual(times(4, () => second()));
  });

  it('should roll the recorded values when it is seeded with mander', () => {
    const random = createRandom('mander');

    expect([
      random(),
      createRandomInt(1, 6, random),
      isRollUnder(0.5, random),
      takeRandom(['a', 'b', 'c'], random),
    ]).toEqual([0.4134875510353595, 5, true, 'a']);
  });

  it('should roll a number from zero up to one when it is asked many times', () => {
    const random = createRandom('range');

    const rolls = times(1000, () => random());

    expect(every(rolls, (roll) => roll >= 0 && roll < 1)).toBe(true);
  });
});
