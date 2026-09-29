import {
  HARD_STRUCTURES,
  NORMAL_STRUCTURES,
  type Sector,
} from '@mander/structures';
import { filter, map, max, size, take, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { pickStructures } from './pick-structures';

const SEED = 'PROBE-SEED';

const OVER_NORMAL = size(NORMAL_STRUCTURES) + 7;

const OVER_HARD = size(HARD_STRUCTURES) + 7;

const seeds = times(20, (day) => `DAY-${day}`);

const hasDuplicates = (picked: Sector[]): boolean =>
  size(uniq(picked)) !== size(picked);

describe('pickStructures', () => {
  it('should never deal the same structure twice when the category can cover the hand', () => {
    const dealt = map(seeds, (seed) =>
      pickStructures(seed, size(NORMAL_STRUCTURES), 'NORMAL'),
    );

    expect(filter(dealt, hasDuplicates)).toEqual([]);
  });

  it('should never deal the same structure twice when it deals out of the hard category', () => {
    const dealt = map(seeds, (seed) => pickStructures(seed, 14, 'HARD'));

    expect(filter(dealt, hasDuplicates)).toEqual([]);
  });

  it('should deal as many as asked for when the category can cover it', () => {
    expect(size(pickStructures(SEED, 7, 'NORMAL'))).toBe(7);
  });

  it('should deal as many as asked for when the category has run short', () => {
    expect(size(pickStructures(SEED, OVER_NORMAL, 'NORMAL'))).toBe(OVER_NORMAL);
    expect(size(pickStructures(SEED, OVER_HARD, 'HARD'))).toBe(OVER_HARD);
  });

  it('should deal the whole category out before it repeats any of it when it is asked for more', () => {
    const dealt = map(seeds, (seed) =>
      pickStructures(seed, OVER_NORMAL, 'NORMAL'),
    );

    expect(
      filter(dealt, (picked) =>
        hasDuplicates(take(picked, size(NORMAL_STRUCTURES))),
      ),
    ).toEqual([]);
  });

  it('should repeat no structure more often than the count forces it to when the category runs short', () => {
    const dealt = pickStructures(SEED, OVER_NORMAL, 'NORMAL');
    const dealtEach = map(NORMAL_STRUCTURES, (structure) =>
      size(filter(dealt, (picked) => picked === structure)),
    );

    expect(max(dealtEach)).toBe(2);
  });

  it('should deal every structure in the category when it is asked for them all', () => {
    const picked = pickStructures(SEED, size(NORMAL_STRUCTURES), 'NORMAL');

    expect(new Set(picked)).toEqual(new Set(NORMAL_STRUCTURES));
  });

  it('should deal the same hand when the seed is the same', () => {
    expect(pickStructures(SEED, 42, 'NORMAL')).toEqual(
      pickStructures(SEED, 42, 'NORMAL'),
    );
  });

  it('should deal a different hand when the seed differs', () => {
    expect(pickStructures(SEED, 42, 'NORMAL')).not.toEqual(
      pickStructures('OTHER-SEED', 42, 'NORMAL'),
    );
  });

  it('should rarely open both hands on the same structure when the hard and normal categories are dealt from one seed', () => {
    const sameOpening = filter(seeds, (seed) => {
      const normal = pickStructures(seed, 42, 'NORMAL');
      const hard = pickStructures(seed, 14, 'HARD');

      return normal[0] === hard[0];
    });

    expect(size(sameOpening)).toBeLessThan(size(seeds) / 2);
  });
});
