import { createRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import { countBy, every, includes, map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { takeRandomSeason } from './take-random-season';

const SEASONS: Season[] = ['SPRING', 'AUTUMN', 'WINTER'];

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
    expect(uniq(DRAWN).sort()).toEqual([...SEASONS].sort());
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
});
