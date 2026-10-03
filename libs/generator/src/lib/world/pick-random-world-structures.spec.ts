import {
  HARD_STRUCTURES,
  NORMAL_STRUCTURES,
  VERTICAL_STRUCTURES,
} from '@mander/structures';
import { createRandom } from '@mander/utils';
import { difference, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { STRUCTURES_PER_LEVEL } from '../consts';
import { pickRandomWorldStructures } from './pick-random-world-structures';
import type { LevelCategory } from './types/level-category';

const SEED = 'PROBE-WORLD';

const LEVEL_CATEGORIES: LevelCategory[] = [
  'NORMAL',
  'VERTICAL',
  'NORMAL',
  'HARD',
];

describe('pickRandomWorldStructures', () => {
  it('should pick enough structures of each category for all of its levels when the world has levels of every category', () => {
    const picked = pickRandomWorldStructures(
      LEVEL_CATEGORIES,
      createRandom(SEED),
    );

    expect(size(picked.NORMAL)).toBe(2 * STRUCTURES_PER_LEVEL);
    expect(size(picked.HARD)).toBe(STRUCTURES_PER_LEVEL);
    expect(size(picked.VERTICAL)).toBe(STRUCTURES_PER_LEVEL);
  });

  it('should pick nothing from a category when no level uses it', () => {
    const picked = pickRandomWorldStructures(
      ['NORMAL', 'NORMAL'],
      createRandom(SEED),
    );

    expect(picked.HARD).toEqual([]);
    expect(picked.VERTICAL).toEqual([]);
  });

  it('should pick the structures of each category only from that category when it picks for every category', () => {
    const picked = pickRandomWorldStructures(
      LEVEL_CATEGORIES,
      createRandom(SEED),
    );

    expect(difference(picked.NORMAL, NORMAL_STRUCTURES)).toEqual([]);
    expect(difference(picked.HARD, HARD_STRUCTURES)).toEqual([]);
    expect(difference(picked.VERTICAL, VERTICAL_STRUCTURES)).toEqual([]);
  });

  it('should pick the same structures when the generator starts from the same seed', () => {
    expect(
      pickRandomWorldStructures(LEVEL_CATEGORIES, createRandom(SEED)),
    ).toEqual(pickRandomWorldStructures(LEVEL_CATEGORIES, createRandom(SEED)));
  });

  it('should pick different structures when the generator starts from another seed', () => {
    expect(
      pickRandomWorldStructures(LEVEL_CATEGORIES, createRandom(SEED)),
    ).not.toEqual(
      pickRandomWorldStructures(LEVEL_CATEGORIES, createRandom('OTHER-SEED')),
    );
  });
});
