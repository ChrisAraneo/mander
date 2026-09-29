import {
  HARD_STRUCTURES,
  NORMAL_STRUCTURES,
  VERTICAL_STRUCTURES,
} from '@mander/structures';
import { difference, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { STRUCTURES_PER_LEVEL } from '../../consts';
import type { LevelCategory } from './types/level-category';
import { pickWorldStructures } from './pick-world-structures';

const WORLD_NAME = 'PROBE-WORLD';

const LEVEL_CATEGORIES: LevelCategory[] = [
  'NORMAL',
  'VERTICAL',
  'NORMAL',
  'HARD',
];

describe('pickWorldStructures', () => {
  it('should pick enough structures of each category for all of its levels', () => {
    const picked = pickWorldStructures(WORLD_NAME, LEVEL_CATEGORIES);

    expect(size(picked.NORMAL)).toBe(2 * STRUCTURES_PER_LEVEL);
    expect(size(picked.HARD)).toBe(STRUCTURES_PER_LEVEL);
    expect(size(picked.VERTICAL)).toBe(STRUCTURES_PER_LEVEL);
  });

  it('should pick nothing from a category when no level uses it', () => {
    const picked = pickWorldStructures(WORLD_NAME, ['NORMAL', 'NORMAL']);

    expect(picked.HARD).toEqual([]);
    expect(picked.VERTICAL).toEqual([]);
  });

  it('should pick the structures of each category only from that category', () => {
    const picked = pickWorldStructures(WORLD_NAME, LEVEL_CATEGORIES);

    expect(difference(picked.NORMAL, NORMAL_STRUCTURES)).toEqual([]);
    expect(difference(picked.HARD, HARD_STRUCTURES)).toEqual([]);
    expect(difference(picked.VERTICAL, VERTICAL_STRUCTURES)).toEqual([]);
  });

  it('should pick the same structures when the world name is the same', () => {
    expect(pickWorldStructures(WORLD_NAME, LEVEL_CATEGORIES)).toEqual(
      pickWorldStructures(WORLD_NAME, LEVEL_CATEGORIES),
    );
  });

  it('should pick different structures when the world name differs', () => {
    expect(pickWorldStructures(WORLD_NAME, LEVEL_CATEGORIES)).not.toEqual(
      pickWorldStructures('OTHER-WORLD', LEVEL_CATEGORIES),
    );
  });
});
