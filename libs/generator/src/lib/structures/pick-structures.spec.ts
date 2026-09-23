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
  it('should never deal the same structure twice when the pool can cover the hand', () => {
    const dealt = map(seeds, (seed) =>
      pickStructures(seed, size(NORMAL_STRUCTURES), 'normal'),
    );

    expect(filter(dealt, hasDuplicates)).toEqual([]);
  });

  it('should never deal the same structure twice when it deals out of the hard pool', () => {
    const dealt = map(seeds, (seed) => pickStructures(seed, 14, 'hard'));

    expect(filter(dealt, hasDuplicates)).toEqual([]);
  });

  it('should deal as many as asked for when the pool can cover it', () => {
    expect(size(pickStructures(SEED, 7, 'normal'))).toBe(7);
  });

  it('should deal as many as asked for when the pool has run short', () => {
    expect(size(pickStructures(SEED, OVER_NORMAL, 'normal'))).toBe(OVER_NORMAL);
    expect(size(pickStructures(SEED, OVER_HARD, 'hard'))).toBe(OVER_HARD);
  });

  it('should deal the whole pool out before it repeats any of it when it is asked for more', () => {
    const dealt = map(seeds, (seed) =>
      pickStructures(seed, OVER_NORMAL, 'normal'),
    );

    expect(
      filter(dealt, (picked) =>
        hasDuplicates(take(picked, size(NORMAL_STRUCTURES))),
      ),
    ).toEqual([]);
  });

  it('should repeat no structure more often than the count forces it to when the pool runs short', () => {
    const dealt = pickStructures(SEED, OVER_NORMAL, 'normal');
    const dealtEach = map(NORMAL_STRUCTURES, (structure) =>
      size(filter(dealt, (picked) => picked === structure)),
    );

    expect(max(dealtEach)).toBe(2);
  });

  it('should deal every structure in the pool when it is asked for them all', () => {
    const picked = pickStructures(SEED, size(NORMAL_STRUCTURES), 'normal');

    expect(new Set(picked)).toEqual(new Set(NORMAL_STRUCTURES));
  });

  it('should deal the same hand when the seed is the same', () => {
    expect(pickStructures(SEED, 42, 'normal')).toEqual(
      pickStructures(SEED, 42, 'normal'),
    );
  });

  it('should deal a different hand when the seed differs', () => {
    expect(pickStructures(SEED, 42, 'normal')).not.toEqual(
      pickStructures('OTHER-SEED', 42, 'normal'),
    );
  });

  it('should rarely open both hands on the same structure when the hard and normal pools are dealt from one seed', () => {
    const sameOpening = filter(seeds, (seed) => {
      const normal = pickStructures(seed, 42, 'normal');
      const hard = pickStructures(seed, 14, 'hard');

      return normal[0] === hard[0];
    });

    expect(size(sameOpening)).toBeLessThan(size(seeds) / 2);
  });
});
