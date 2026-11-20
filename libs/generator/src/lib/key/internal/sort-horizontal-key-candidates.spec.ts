import { TILE_AIR, type Tile } from '@mander/model';
import { map, range, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { sortHorizontalKeyCandidates } from './sort-horizontal-key-candidates';

const createLevel = (width: number): Tile[][] => [times(width, () => TILE_AIR)];

const sortColumns = (width: number, columns: number[]): number[] =>
  map(
    sortHorizontalKeyCandidates(
      createLevel(width),
      map(columns, (column) => ({ row: 3, column })),
    ),
    (candidate) => candidate.column,
  );

const WIDE_LEVEL_WIDTH = 60;

const SEAM_COLUMN = 20;

describe('sortHorizontalKeyCandidates', () => {
  it('should put the seam between the middle structures first when all columns are free', () => {
    expect(sortColumns(WIDE_LEVEL_WIDTH, range(WIDE_LEVEL_WIDTH))[0]).toBe(
      SEAM_COLUMN,
    );
  });

  it('should put the columns nearest the seam first when it gets columns on both sides', () => {
    expect(sortColumns(60, [0, 40, 21, 20, 19])).toEqual([20, 19, 21, 0, 40]);
  });

  it('should put the left column first when two columns are as far from the seam', () => {
    expect(sortColumns(60, [21, 19])).toEqual([19, 21]);
  });

  it('should give nothing back when there are no candidates', () => {
    expect(sortColumns(60, [])).toEqual([]);
  });
});
