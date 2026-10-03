import { describe, expect, it } from 'vitest';

import { getLevelCategories } from './get-level-categories';

describe('getLevelCategories', () => {
  it('should give the category of each level in order when it is given a whole day', () => {
    expect(getLevelCategories(8)).toEqual([
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
    expect(getLevelCategories(0)).toEqual([]);
  });
});
