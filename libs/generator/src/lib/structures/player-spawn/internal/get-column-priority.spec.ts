import { map, sortBy } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { getColumnPriority } from './get-column-priority';

const getPriority = (column: number): number =>
  getColumnPriority({ row: 3, column });

describe('getColumnPriority', () => {
  it('should give column 1 the best priority when it gets it', () => {
    expect(getPriority(1)).toBe(0);
  });

  it('should rank the first six columns in the preferred order when it gets them', () => {
    expect(map([1, 2, 3, 0, 4, 5], getPriority)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('should rank a column past the first six after all of them when it gets one', () => {
    expect(sortBy([6, 5, 4, 0, 3, 2, 1], getPriority)).toEqual([
      1, 2, 3, 0, 4, 5, 6,
    ]);
  });

  it('should rank the far columns from left to right when it gets several', () => {
    expect(sortBy([8, 6, 7], getPriority)).toEqual([6, 7, 8]);
  });

  it('should not care about the row when it ranks a column', () => {
    expect(getColumnPriority({ row: 9, column: 2 })).toBe(
      getColumnPriority({ row: 0, column: 2 }),
    );
  });
});
