import {
  HARD_STRUCTURES,
  NORMAL_STRUCTURES,
  type Sector,
} from '@mander/structures';
import {
  difference,
  filter,
  map,
  max,
  size,
  take,
  times,
  uniq,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { pickStructures } from './pick-structures';

const SEED = 'PROBE-SEED';

const OVER_NORMAL = size(NORMAL_STRUCTURES) + 7;

const OVER_HARD = size(HARD_STRUCTURES) + 7;

const SEEDS = times(20, (day) => `DAY-${day}`);

const hasDuplicates = (picked: Sector[]): boolean =>
  size(uniq(picked)) !== size(picked);

describe('pickStructures', () => {
  it('should never pick the same structure twice when the category can cover the hand', () => {
    const pickedBySeed = map(SEEDS, (seed) =>
      pickStructures(seed, size(NORMAL_STRUCTURES), 'NORMAL'),
    );

    expect(filter(pickedBySeed, hasDuplicates)).toEqual([]);
  });

  it('should never pick the same structure twice when it picks out of the hard category', () => {
    const pickedBySeed = map(SEEDS, (seed) => pickStructures(seed, 14, 'HARD'));

    expect(filter(pickedBySeed, hasDuplicates)).toEqual([]);
  });

  it('should pick as many as asked for when the category can cover it', () => {
    expect(size(pickStructures(SEED, 7, 'NORMAL'))).toBe(7);
  });

  it('should pick as many as asked for when the category has run short', () => {
    expect(size(pickStructures(SEED, OVER_NORMAL, 'NORMAL'))).toBe(OVER_NORMAL);
    expect(size(pickStructures(SEED, OVER_HARD, 'HARD'))).toBe(OVER_HARD);
  });

  it('should pick the whole category before it repeats any of it when it is asked for more', () => {
    const pickedBySeed = map(SEEDS, (seed) =>
      pickStructures(seed, OVER_NORMAL, 'NORMAL'),
    );

    expect(
      filter(pickedBySeed, (picked) =>
        hasDuplicates(take(picked, size(NORMAL_STRUCTURES))),
      ),
    ).toEqual([]);
  });

  it('should repeat no structure more often than the count forces it to when the category runs short', () => {
    const picked = pickStructures(SEED, OVER_NORMAL, 'NORMAL');
    const pickedEach = map(NORMAL_STRUCTURES, (structure) =>
      size(filter(picked, (pickedStructure) => pickedStructure === structure)),
    );

    expect(max(pickedEach)).toBe(2);
  });

  it('should pick every structure in the category when it is asked for them all', () => {
    const picked = pickStructures(SEED, size(NORMAL_STRUCTURES), 'NORMAL');

    expect(difference([...NORMAL_STRUCTURES], picked)).toEqual([]);
  });

  it('should pick the same hand when the seed is the same', () => {
    expect(pickStructures(SEED, 42, 'NORMAL')).toEqual(
      pickStructures(SEED, 42, 'NORMAL'),
    );
  });

  it('should pick a different hand when the seed differs', () => {
    expect(pickStructures(SEED, 42, 'NORMAL')).not.toEqual(
      pickStructures('OTHER-SEED', 42, 'NORMAL'),
    );
  });

  it('should rarely open both hands on the same structure when the hard and normal categories are picked from one seed', () => {
    const sameOpening = filter(SEEDS, (seed) => {
      const normal = pickStructures(seed, 42, 'NORMAL');
      const hard = pickStructures(seed, 14, 'HARD');

      return normal[0] === hard[0];
    });

    expect(size(sameOpening)).toBeLessThan(size(SEEDS) / 2);
  });
});
