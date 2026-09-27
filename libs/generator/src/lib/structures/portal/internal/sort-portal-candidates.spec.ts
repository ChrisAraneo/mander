import { TILE_AIR, type Tile } from '@mander/model';
import { map, range, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Spot } from '../../find-standing-spots';
import type { LevelType } from '../../get-level-type';
import { sortPortalCandidates } from './sort-portal-candidates';

const createLevel = (width: number): Tile[][] => [times(width, () => TILE_AIR)];

const sortCandidates = (
  width: number,
  candidates: Spot[],
  levelType: LevelType,
) =>
  sortPortalCandidates({ tiles: createLevel(width), levelType, candidates })
    .candidates;

const sortColumns = (width: number, columns: number[]): number[] =>
  map(
    sortCandidates(
      width,
      map(columns, (column) => ({ row: 3, column })),
      'HORIZONTAL',
    ),
    'column',
  );

describe('sortPortalCandidates', () => {
  it('should put the second column from the right first in a horizontal level when all columns are free', () => {
    expect(sortColumns(6, range(6))[0]).toBe(4);
  });

  it('should put the columns near the right edge first in a horizontal level when it is six wide', () => {
    expect(sortColumns(6, range(6))).toEqual([4, 3, 2, 5, 1, 0]);
  });

  it('should put the far left columns last in a horizontal level when it is wider than four', () => {
    expect(sortColumns(8, range(8))).toEqual([6, 5, 4, 7, 3, 2, 1, 0]);
  });

  it('should count from the right edge of the grid in a horizontal level when it is wider', () => {
    expect(sortColumns(10, [6, 7, 8, 9])).toEqual([8, 7, 6, 9]);
  });

  it('should sort the far columns from right to left in a horizontal level when it only gets far columns', () => {
    expect(sortColumns(10, [0, 2, 1])).toEqual([2, 1, 0]);
  });

  it('should sort only the columns it gets in a horizontal level when some are missing', () => {
    expect(sortColumns(6, [0, 5, 3])).toEqual([3, 5, 0]);
  });

  it('should keep the row of each candidate in a horizontal level when it sorts', () => {
    expect(
      sortCandidates(
        6,
        [
          { row: 4, column: 3 },
          { row: 2, column: 4 },
        ],
        'HORIZONTAL',
      ),
    ).toEqual([
      { row: 2, column: 4 },
      { row: 4, column: 3 },
    ]);
  });

  it('should put the highest candidate first in a vertical level when the candidates are on different rows', () => {
    expect(
      sortCandidates(
        5,
        [
          { row: 3, column: 2 },
          { row: 1, column: 0 },
        ],
        'VERTICAL',
      ),
    ).toEqual([
      { row: 1, column: 0 },
      { row: 3, column: 2 },
    ]);
  });

  it('should put the candidate nearest the middle first in a vertical level when the candidates are on the same row', () => {
    expect(
      sortCandidates(
        5,
        [
          { row: 3, column: 0 },
          { row: 3, column: 3 },
          { row: 3, column: 2 },
        ],
        'VERTICAL',
      ),
    ).toEqual([
      { row: 3, column: 2 },
      { row: 3, column: 3 },
      { row: 3, column: 0 },
    ]);
  });

  it('should keep the old order in a vertical level when two candidates are as far from the middle', () => {
    expect(
      sortCandidates(
        5,
        [
          { row: 3, column: 4 },
          { row: 3, column: 0 },
        ],
        'VERTICAL',
      ),
    ).toEqual([
      { row: 3, column: 4 },
      { row: 3, column: 0 },
    ]);
  });

  it('should give nothing back in a horizontal level when there are no candidates', () => {
    expect(sortCandidates(6, [], 'HORIZONTAL')).toEqual([]);
  });

  it('should give nothing back in a vertical level when there are no candidates', () => {
    expect(sortCandidates(5, [], 'VERTICAL')).toEqual([]);
  });

  it('should keep the grid the same when it sorts', () => {
    const tiles = createLevel(3);

    expect(
      sortPortalCandidates({ tiles, levelType: 'HORIZONTAL', candidates: [] })
        .tiles,
    ).toBe(tiles);
  });
});
