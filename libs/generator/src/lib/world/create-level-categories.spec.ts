import { describe, expect, it } from 'vitest';

import { createLevelCategories } from './create-level-categories';

describe('createLevelCategories', () => {
  it('should give the category of each level in order when it is given a whole day', () => {
    expect(createLevelCategories(8)).toEqual([
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
    expect(createLevelCategories(0)).toEqual([]);
  });
});
