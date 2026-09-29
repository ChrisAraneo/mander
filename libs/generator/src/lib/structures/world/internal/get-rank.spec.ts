import { describe, expect, it } from 'vitest';

import type { LevelCategory } from '../types/level-category';
import { getRank } from './get-rank';

const LEVEL_CATEGORIES: LevelCategory[] = [
  'NORMAL',
  'VERTICAL',
  'NORMAL',
  'NORMAL',
  'VERTICAL',
  'NORMAL',
  'HARD',
  'HARD',
];

describe('getRank', () => {
  it('should give zero when the level is the first of its category', () => {
    expect(getRank(LEVEL_CATEGORIES, 0)).toBe(0);
    expect(getRank(LEVEL_CATEGORIES, 1)).toBe(0);
    expect(getRank(LEVEL_CATEGORIES, 6)).toBe(0);
  });

  it('should count only the earlier levels of the same category', () => {
    expect(getRank(LEVEL_CATEGORIES, 4)).toBe(1);
    expect(getRank(LEVEL_CATEGORIES, 5)).toBe(3);
    expect(getRank(LEVEL_CATEGORIES, 7)).toBe(1);
  });
});
