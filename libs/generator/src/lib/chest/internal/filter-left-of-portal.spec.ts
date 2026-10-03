import { map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CHEST_PORTAL_GAP } from '../../consts';
import { filterLeftOfPortal } from './filter-left-of-portal';

const createCandidates = (columns: number[]) =>
  map(columns, (column) => ({ row: 2, column }));

const filterColumns = (columns: number[], anchor: number): number[] =>
  map(filterLeftOfPortal(createCandidates(columns), anchor), 'column');

describe('filterLeftOfPortal', () => {
  it('should keep the columns far enough left of the anchor when it gets many', () => {
    expect(filterColumns(range(7), 5)).toEqual([0, 1, 2, 3]);
  });

  it('should keep the column right at the gap and drop the one after it when they are next to the anchor', () => {
    expect(
      filterColumns([5 - CHEST_PORTAL_GAP, 5 - CHEST_PORTAL_GAP + 1], 5),
    ).toEqual([5 - CHEST_PORTAL_GAP]);
  });

  it('should keep nothing when the anchor is nearer the left edge than the gap', () => {
    expect(filterColumns(range(6), CHEST_PORTAL_GAP - 1)).toEqual([]);
  });

  it('should keep the row of each candidate when it filters', () => {
    expect(
      filterLeftOfPortal(
        [
          { row: 4, column: 0 },
          { row: 1, column: 6 },
        ],
        5,
      ),
    ).toEqual([{ row: 4, column: 0 }]);
  });

  it('should keep nothing when it gets no candidates', () => {
    expect(filterLeftOfPortal([], 5)).toEqual([]);
  });
});
