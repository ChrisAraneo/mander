import { describe, expect, it } from 'vitest';

import type { LevelVariant } from '../types/level-variant';
import { createLevelCategories } from './create-level-categories';

const createLevelVariants = (): LevelVariant[] => [
  'NORMAL',
  'VERTICAL',
  'MIRRORED',
  'NORMAL',
  'VERTICAL',
  'MIRRORED',
  'HARD',
  'HARD',
];

describe('createLevelCategories', () => {
  it('should give the category of each level in order when it is given a whole day', () => {
    expect(createLevelCategories(createLevelVariants())).toEqual([
      'NORMAL',
      'VERTICAL',
      'NORMAL',
      'NORMAL',
      'VERTICAL',
      'NORMAL',
      'HARD',
      'HARD',
    ]);
  });

  it('should give no categories when there are no levels', () => {
    expect(createLevelCategories([])).toEqual([]);
  });

  it('should not change the old level variants when it reads their categories', () => {
    const levelVariants = createLevelVariants();

    createLevelCategories(levelVariants);

    expect(levelVariants).toEqual(createLevelVariants());
  });
});
