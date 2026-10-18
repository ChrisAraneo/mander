import { TILE_AIR, type Tile } from '@mander/model';
import { map, range, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { sortHorizontalPortalCandidates } from './sort-horizontal-portal-candidates';

const createLevel = (width: number): Tile[][] => [times(width, () => TILE_AIR)];

const sortColumns = (width: number, columns: number[]): number[] =>
  map(
    sortHorizontalPortalCandidates(
      createLevel(width),
      map(columns, (column) => ({ row: 3, column })),
    ),
    (candidate) => candidate.column,
  );

describe('sortHorizontalPortalCandidates', () => {
  it('should put the second column from the right first when all columns are free', () => {
    expect(sortColumns(10, range(10))[0]).toBe(8);
  });

  it('should put the columns near the right edge first in their preferred order when the level is wide', () => {
    expect(sortColumns(10, range(10))).toEqual([8, 7, 6, 9, 5, 4, 3, 2, 1, 0]);
  });

  it('should give nothing back when there are no candidates', () => {
    expect(sortColumns(10, [])).toEqual([]);
  });
});
