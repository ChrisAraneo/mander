import { map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CHEST_PORTAL_GAP } from '../../../consts';
import { filterBelowPortal } from './filter-below-portal';

const createCandidates = (rows: number[]) =>
  map(rows, (row) => ({ row, column: 0 }));

const filterRows = (rows: number[], anchor: number): number[] =>
  map(filterBelowPortal(createCandidates(rows), anchor), 'row');

describe('filterBelowPortal', () => {
  it('should keep the rows far enough below the anchor when it gets many', () => {
    expect(filterRows(range(7), 1)).toEqual([3, 4, 5, 6]);
  });

  it('should keep the row right at the gap and drop the one before it when they are next to the anchor', () => {
    expect(
      filterRows([1 + CHEST_PORTAL_GAP - 1, 1 + CHEST_PORTAL_GAP], 1),
    ).toEqual([1 + CHEST_PORTAL_GAP]);
  });

  it('should keep nothing when every row is above the gap', () => {
    expect(filterRows(range(4), 3)).toEqual([]);
  });

  it('should keep the column of each candidate when it filters', () => {
    expect(
      filterBelowPortal(
        [
          { row: 0, column: 4 },
          { row: 5, column: 2 },
        ],
        1,
      ),
    ).toEqual([{ row: 5, column: 2 }]);
  });

  it('should keep nothing when it gets no candidates', () => {
    expect(filterBelowPortal([], 1)).toEqual([]);
  });
});
