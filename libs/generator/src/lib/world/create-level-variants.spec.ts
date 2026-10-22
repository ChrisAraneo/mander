import { createRandom } from '@mander/engine';
import {
  countBy,
  join,
  map,
  size,
  take,
  takeRight,
  times,
  uniq,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FIRST_HARD_LEVEL, LEVELS_PER_DAY } from '../consts';
import { createLevelVariants } from './create-level-variants';

const EARLY_LEVELS = FIRST_HARD_LEVEL - 1;

const LATE_LEVELS = LEVELS_PER_DAY - EARLY_LEVELS;

const SEEDS = map(times(20), (day) => `DAY-${day}`);

const createOn = (seed: string) => createLevelVariants(createRandom(seed));

describe('createLevelVariants', () => {
  it('should give a variant for every level of the day when it deals a world', () => {
    expect(size(createOn('DAY-1'))).toBe(LEVELS_PER_DAY);
  });

  it('should deal two of each variant over the early levels when it deals a world', () => {
    const counts = map(SEEDS, (seed) =>
      countBy(take(createOn(seed), EARLY_LEVELS)),
    );

    expect(counts).toEqual(
      map(SEEDS, () => ({ VERTICAL: 2, MIRRORED: 2, NORMAL: 2 })),
    );
  });

  it('should leave the last levels of the day hard when it deals a world', () => {
    const late = map(SEEDS, (seed) => takeRight(createOn(seed), LATE_LEVELS));

    expect(late).toEqual(map(SEEDS, () => ['HARD', 'HARD']));
  });

  it('should deal the variants in the same order when the generator starts from the same seed', () => {
    expect(createOn('DAY-1')).toEqual(createOn('DAY-1'));
  });

  it('should deal the variants in another order when the generator starts from another seed', () => {
    const orders = uniq(map(SEEDS, (seed) => join(createOn(seed), ',')));

    expect(size(orders)).toBeGreaterThan(1);
  });
});
