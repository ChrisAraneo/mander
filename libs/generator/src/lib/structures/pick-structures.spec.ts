import {
  HARD_STRUCTURES,
  NORMAL_STRUCTURES,
  type Structure,
} from '@mander/structures';
import { filter, map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { pickStructures } from './pick-structures';

const SEED = 'PROBE-SEED';

const seeds = times(20, (day) => `DAY-${day}`);

const hasDuplicates = (picked: Structure[]): boolean =>
  size(uniq(picked)) !== size(picked);

describe('pickStructures', () => {
  it('never deals the same structure twice', () => {
    const dealt = map(seeds, (seed) => pickStructures(seed, 42, 'normal'));

    expect(filter(dealt, hasDuplicates)).toEqual([]);
  });

  it('never deals the same structure twice out of the hard pool', () => {
    const dealt = map(seeds, (seed) => pickStructures(seed, 14, 'hard'));

    expect(filter(dealt, hasDuplicates)).toEqual([]);
  });

  it('deals as many as asked for while the pool can cover it', () => {
    expect(size(pickStructures(SEED, 7, 'normal'))).toBe(7);
  });

  it('deals the whole pool rather than repeat itself to reach the count', () => {
    expect(size(pickStructures(SEED, 999, 'normal'))).toBe(
      size(NORMAL_STRUCTURES),
    );
    expect(size(pickStructures(SEED, 999, 'hard'))).toBe(size(HARD_STRUCTURES));
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

  /**
   * The pools share all but one structure, so a seed used bare would walk both
   * shuffles down the same random stream and open the hard level on whatever
   * the normal level opened on.
   */
  it('does not deal the hard level the front of the normal one', () => {
    const sameOpening = filter(seeds, (seed) => {
      const normal = pickStructures(seed, 42, 'normal');
      const hard = pickStructures(seed, 14, 'hard');

      return normal[0] === hard[0];
    });

    expect(size(sameOpening)).toBeLessThan(size(seeds) / 2);
  });
});
