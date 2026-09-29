import { HARD_STRUCTURES, NORMAL_STRUCTURES } from '@mander/structures';
import { slice, take } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { LevelCategory } from './types/level-category';
import type { WorldStructures } from './types/world-structures';
import { sliceForLevel } from './slice-for-level';

const LEVEL_CATEGORIES: LevelCategory[] = ['NORMAL', 'HARD', 'NORMAL'];

const WORLD: WorldStructures = {
  NORMAL: take(NORMAL_STRUCTURES, 4),
  HARD: take(HARD_STRUCTURES, 2),
  VERTICAL: [],
};

describe('sliceForLevel', () => {
  it('should give the first share of its category when the level is the first of that category', () => {
    expect(sliceForLevel(WORLD, LEVEL_CATEGORIES, 0)).toEqual(
      take(NORMAL_STRUCTURES, 2),
    );
  });

  it('should give the next share of its category when the level is a later one of that category', () => {
    expect(sliceForLevel(WORLD, LEVEL_CATEGORIES, 2)).toEqual(
      slice(NORMAL_STRUCTURES, 2, 4),
    );
  });

  it('should give the structures of its own category when the levels around it use another category', () => {
    expect(sliceForLevel(WORLD, LEVEL_CATEGORIES, 1)).toEqual(
      take(HARD_STRUCTURES, 2),
    );
  });

  it('should leave the extra structures out when they do not split evenly across the levels', () => {
    const uneven: WorldStructures = {
      ...WORLD,
      NORMAL: take(NORMAL_STRUCTURES, 5),
    };

    expect(sliceForLevel(uneven, LEVEL_CATEGORIES, 2)).toEqual(
      slice(NORMAL_STRUCTURES, 2, 4),
    );
  });
});
