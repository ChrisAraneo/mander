import { map, sortBy } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findColumnPriority } from './find-column-priority';

const findPriority = (column: number): number =>
  findColumnPriority({ row: 3, column });

describe('findColumnPriority', () => {
  it('should give column 1 the best priority when it gets it', () => {
    expect(findPriority(1)).toBe(0);
  });

  it('should rank the first six columns in the preferred order when it gets them', () => {
    expect(map([1, 2, 3, 0, 4, 5], findPriority)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('should rank a column past the first six after all of them when it gets one', () => {
    expect(sortBy([6, 5, 4, 0, 3, 2, 1], findPriority)).toEqual([
      1, 2, 3, 0, 4, 5, 6,
    ]);
  });

  it('should rank the far columns from left to right when it gets several', () => {
    expect(sortBy([8, 6, 7], findPriority)).toEqual([6, 7, 8]);
  });

  it('should not care about the row when it ranks a column', () => {
    expect(findColumnPriority({ row: 9, column: 2 })).toBe(
      findColumnPriority({ row: 0, column: 2 }),
    );
  });
});
