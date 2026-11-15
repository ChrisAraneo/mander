import { constant, includes, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRandom } from './create-random';
import { isRollUnder } from './is-roll-under';

describe('isRollUnder', () => {
  it('should be true when the roll is below the probability', () => {
    expect(isRollUnder(0.5, constant(0.4))).toBe(true);
  });

  it('should be false when the roll equals the probability', () => {
    expect(isRollUnder(0.5, constant(0.5))).toBe(false);
  });

  it('should never be true when the probability is zero', () => {
    const random = createRandom('never');

    const rolls = times(100, () => isRollUnder(0, random));

    expect(includes(rolls, true)).toBe(false);
  });

  it('should give the same answers when it is seeded with the same text', () => {
    const first = createRandom('mander');
    const second = createRandom('mander');

    expect(times(8, () => isRollUnder(0.5, first))).toEqual(
      times(8, () => isRollUnder(0.5, second)),
    );
  });

  it('should give other answers when it is seeded with other text', () => {
    const first = createRandom('mander');
    const second = createRandom('Mander');

    expect(times(8, () => isRollUnder(0.5, first))).not.toEqual(
      times(8, () => isRollUnder(0.5, second)),
    );
  });
});
