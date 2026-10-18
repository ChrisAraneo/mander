import { describe, expect, it } from 'vitest';

import type { LevelCategory } from '../types/level-category';
import { countEarlierCopies } from './count-earlier-copies';

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

describe('countEarlierCopies', () => {
  it('should give zero when the level is the first of its category', () => {
    expect(countEarlierCopies(LEVEL_CATEGORIES, 0)).toBe(0);
    expect(countEarlierCopies(LEVEL_CATEGORIES, 1)).toBe(0);
    expect(countEarlierCopies(LEVEL_CATEGORIES, 6)).toBe(0);
  });

  it('should count only the earlier levels of the same category when other categories come between them', () => {
    expect(countEarlierCopies(LEVEL_CATEGORIES, 4)).toBe(1);
    expect(countEarlierCopies(LEVEL_CATEGORIES, 5)).toBe(3);
    expect(countEarlierCopies(LEVEL_CATEGORIES, 7)).toBe(1);
  });
});
