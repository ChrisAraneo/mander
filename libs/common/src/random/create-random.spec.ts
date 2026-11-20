import { every, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRandom } from './create-random';
import { createRandomInt } from './create-random-int';
import { isRollUnder } from './is-roll-under';
import { tryTakeRandom } from './try-take-random';

const FIRST_MANDER_ROLL = 0.4134875510353595;

const DICE_LOWEST = 1;

const DICE_HIGHEST = 6;

const EVEN_PROBABILITY = 0.5;

const VALUES = ['a', 'b', 'c'];

const ROLL_COUNT = 1000;

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

    const roll = random();

    expect(roll).toBeCloseTo(FIRST_MANDER_ROLL);
    expect([
      createRandomInt(DICE_LOWEST, DICE_HIGHEST, random),
      isRollUnder(EVEN_PROBABILITY, random),
      tryTakeRandom(VALUES, random),
    ]).toEqual([5, true, 'a']);
  });

  it('should roll a number from zero up to one when it is asked many times', () => {
    const random = createRandom('range');

    const rolls = times(ROLL_COUNT, () => random());

    expect(every(rolls, (roll) => roll >= 0 && roll < 1)).toBe(true);
  });
});
