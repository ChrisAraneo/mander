import { createRandom } from '@mander/engine';
import {
  getStructureName,
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
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { takeRandomStructures } from './take-random-structures';

const SEED = 'PROBE-SEED';

const OVER_NORMAL = size(NORMAL_STRUCTURES) + 7;

const OVER_HARD = size(HARD_STRUCTURES) + 7;

const SEEDS = times(20, (day) => `DAY-${day}`);

const hasDuplicates = (picked: Sector[]): boolean =>
  size(uniq(picked)) !== size(picked);

describe('takeRandomStructures', () => {
  it('should never pick the same structure twice when the category can cover the hand', () => {
    const pickedBySeed = map(SEEDS, (seed) =>
      takeRandomStructures(
        size(NORMAL_STRUCTURES),
        'NORMAL',
        createRandom(seed),
      ),
    );

    expect(filter(pickedBySeed, hasDuplicates)).toEqual([]);
  });

  it('should never pick the same structure twice when it picks out of the hard category', () => {
    const pickedBySeed = map(SEEDS, (seed) =>
      takeRandomStructures(14, 'HARD', createRandom(seed)),
    );

    expect(filter(pickedBySeed, hasDuplicates)).toEqual([]);
  });

  it('should pick as many as asked for when the category can cover it', () => {
    expect(size(takeRandomStructures(7, 'NORMAL', createRandom(SEED)))).toBe(7);
  });

  it('should pick as many as asked for when the category has run short', () => {
    expect(
      size(takeRandomStructures(OVER_NORMAL, 'NORMAL', createRandom(SEED))),
    ).toBe(OVER_NORMAL);
    expect(
      size(takeRandomStructures(OVER_HARD, 'HARD', createRandom(SEED))),
    ).toBe(OVER_HARD);
  });

  it('should pick the whole category before it repeats any of it when it is asked for more', () => {
    const pickedBySeed = map(SEEDS, (seed) =>
      takeRandomStructures(OVER_NORMAL, 'NORMAL', createRandom(seed)),
    );

    expect(
      filter(pickedBySeed, (picked) =>
        hasDuplicates(take(picked, size(NORMAL_STRUCTURES))),
      ),
    ).toEqual([]);
  });

  it('should repeat no structure more often than the count forces it to when the category runs short', () => {
    const picked = takeRandomStructures(
      OVER_NORMAL,
      'NORMAL',
      createRandom(SEED),
    );
    const pickedEach = map(NORMAL_STRUCTURES, (structure) =>
      size(filter(picked, (pickedStructure) => pickedStructure === structure)),
    );

    expect(max(pickedEach)).toBe(2);
  });

  it('should pick every structure in the category when it is asked for them all', () => {
    const picked = takeRandomStructures(
      size(NORMAL_STRUCTURES),
      'NORMAL',
      createRandom(SEED),
    );

    expect(difference([...NORMAL_STRUCTURES], picked)).toEqual([]);
  });

  it('should pick the same hand when the generator starts from the same seed', () => {
    expect(takeRandomStructures(42, 'NORMAL', createRandom(SEED))).toEqual(
      takeRandomStructures(42, 'NORMAL', createRandom(SEED)),
    );
  });

  it('should pick a different hand when the generator starts from another seed', () => {
    expect(takeRandomStructures(42, 'NORMAL', createRandom(SEED))).not.toEqual(
      takeRandomStructures(42, 'NORMAL', createRandom('OTHER-SEED')),
    );
  });

  it('should rarely open both hands on the same structure when the hard and normal categories are picked one after the other from one generator', () => {
    const sameOpening = filter(SEEDS, (seed) =>
      pipe(
        seed,
        createRandom,
        (random) => ({
          normal: takeRandomStructures(42, 'NORMAL', random),
          random,
        }),
        ({ normal, random }) =>
          normal[0] === takeRandomStructures(14, 'HARD', random)[0],
      ),
    );

    expect(size(sameOpening)).toBeLessThan(size(SEEDS) / 2);
  });

  it('should pick the recorded structures when the generator starts from the seed DAY-1', () => {
    expect(
      map(
        takeRandomStructures(9, 'NORMAL', createRandom('DAY-1')),
        getStructureName,
      ),
    ).toEqual([
      'NORMAL_178',
      'NORMAL_164',
      'NORMAL_157',
      'NORMAL_035',
      'NORMAL_109',
      'NORMAL_042',
      'NORMAL_019',
      'NORMAL_038',
      'NORMAL_135',
    ]);
  });
});
