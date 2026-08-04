import {
  HARD_STRUCTURES,
  NORMAL_STRUCTURES,
  type Structure,
} from '@mander/structures';
import { filter, map, max, size, take, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { pickStructures } from './pick-structures';

const SEED = 'PROBE-SEED';

const OVER_NORMAL = size(NORMAL_STRUCTURES) + 7;

const OVER_HARD = size(HARD_STRUCTURES) + 7;

const seeds = times(20, (day) => `DAY-${day}`);

const hasDuplicates = (picked: Structure[]): boolean =>
  size(uniq(picked)) !== size(picked);

describe('pickStructures', () => {
  it('never deals the same structure twice', () => {
    const dealt = map(seeds, (seed) =>
      pickStructures(seed, size(NORMAL_STRUCTURES), 'normal'),
    );

    expect(filter(dealt, hasDuplicates)).toEqual([]);
  });

  it('never deals the same structure twice out of the hard pool', () => {
    const dealt = map(seeds, (seed) => pickStructures(seed, 14, 'hard'));

    expect(filter(dealt, hasDuplicates)).toEqual([]);
  });

  it('deals as many as asked for while the pool can cover it', () => {
    expect(size(pickStructures(SEED, 7, 'normal'))).toBe(7);
  });

  it('deals as many as asked for once the pool has run short', () => {
    expect(size(pickStructures(SEED, OVER_NORMAL, 'normal'))).toBe(OVER_NORMAL);
    expect(size(pickStructures(SEED, OVER_HARD, 'hard'))).toBe(OVER_HARD);
  });

  it('deals the whole pool out before it repeats any of it', () => {
    const dealt = map(seeds, (seed) =>
      pickStructures(seed, OVER_NORMAL, 'normal'),
    );

    expect(
      filter(dealt, (picked) =>
        hasDuplicates(take(picked, size(NORMAL_STRUCTURES))),
      ),
    ).toEqual([]);
  });

  it('repeats no structure more often than the count forces it to', () => {
    const dealt = pickStructures(SEED, OVER_NORMAL, 'normal');
    const dealtEach = map(NORMAL_STRUCTURES, (structure) =>
      size(filter(dealt, (picked) => picked === structure)),
    );

    expect(max(dealtEach)).toBe(2);
  });

  it('deals every structure in the pool when it is asked for them all', () => {
    const picked = pickStructures(SEED, size(NORMAL_STRUCTURES), 'normal');

    expect(new Set(picked)).toEqual(new Set(NORMAL_STRUCTURES));
  });

  it('deals the same hand from the same seed', () => {
    expect(pickStructures(SEED, 42, 'normal')).toEqual(
      pickStructures(SEED, 42, 'normal'),
    );
  });

  it('deals a different hand from a different seed', () => {
    expect(pickStructures(SEED, 42, 'normal')).not.toEqual(
      pickStructures('OTHER-SEED', 42, 'normal'),
    );
  });

  it('does not deal the hard level the front of the normal one', () => {
    const sameOpening = filter(seeds, (seed) => {
      const normal = pickStructures(seed, 42, 'normal');
      const hard = pickStructures(seed, 14, 'hard');

      return normal[0] === hard[0];
    });

    expect(size(sameOpening)).toBeLessThan(size(seeds) / 2);
  });
});
