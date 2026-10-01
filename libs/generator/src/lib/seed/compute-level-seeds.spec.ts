import { hashString } from '@mander/utils';
import { size, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY } from '../consts';
import { computeLevelSeeds } from './compute-level-seeds';

const DATE = new Date(Date.UTC(2026, 0, 5));

describe('computeLevelSeeds', () => {
  it('should give one seed for each level when it is given a day', () => {
    expect(size(computeLevelSeeds(DATE))).toBe(LEVELS_PER_DAY);
  });

  it('should give every level a seed of its own when it is given a day', () => {
    expect(size(uniq(computeLevelSeeds(DATE)))).toBe(LEVELS_PER_DAY);
  });

  it('should hash the day and the index of the level when it makes a seed', () => {
    expect(computeLevelSeeds(DATE)[3]).toBe(hashString('2026-01-05#3'));
  });

  it('should give the same seeds when it is given the same day', () => {
    expect(computeLevelSeeds(DATE)).toEqual(
      computeLevelSeeds(new Date(Date.UTC(2026, 0, 5, 18))),
    );
  });

  it('should give other seeds when the day is different', () => {
    expect(computeLevelSeeds(DATE)).not.toEqual(
      computeLevelSeeds(new Date(Date.UTC(2026, 0, 6))),
    );
  });
});
