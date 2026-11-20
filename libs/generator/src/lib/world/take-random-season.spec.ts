import { createRandom } from '@mander/common';
import {
  countBy,
  every,
  includes,
  map,
  size,
  sortBy,
  times,
  uniq,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SEASONS } from './consts';
import { takeRandomSeason } from './take-random-season';

const DRAWS = 2000;

const EVEN_SHARE = 1 / size(SEASONS);

const TOLERANCE = 0.05;

const DRAWN = map(
  times(DRAWS, (day) => `WORLD-${day}`),
  (seed) => takeRandomSeason(createRandom(seed)),
);

describe('takeRandomSeason', () => {
  it('should draw a season the game knows when it turns the year', () => {
    expect(every(DRAWN, (season) => includes(SEASONS, season))).toBe(true);
  });

  it('should draw every season when it turns the year many times', () => {
    expect(sortBy(uniq(DRAWN))).toEqual(sortBy([...SEASONS]));
  });

  it('should give every season the same share when it turns the year many times', () => {
    expect(
      every(
        SEASONS,
        (season) =>
          Math.abs(countBy(DRAWN)[season] / DRAWS - EVEN_SHARE) < TOLERANCE,
      ),
    ).toBe(true);
  });

  it('should draw the same season when the generator starts from the same seed', () => {
    expect(takeRandomSeason(createRandom('WORLD-1'))).toBe(
      takeRandomSeason(createRandom('WORLD-1')),
    );
  });

  it('should draw another season when the generator starts from another seed', () => {
    expect(size(uniq(DRAWN))).toBeGreaterThan(1);
  });
});
