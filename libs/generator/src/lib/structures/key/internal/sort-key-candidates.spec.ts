import { TILE_AIR, type Tile } from '@mander/model';
import { map, range, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Spot } from '../../find-standing-spots';
import type { LevelType } from '../../get-level-type';
import { sortKeyCandidates } from './sort-key-candidates';

const createLevel = (width: number, height: number): Tile[][] =>
  times(height, () => times(width, () => TILE_AIR));

const sortCandidates = (
  width: number,
  height: number,
  candidates: Spot[],
  levelType: LevelType,
) =>
  sortKeyCandidates({
    tiles: createLevel(width, height),
    levelType,
    candidates,
  }).candidates;

const sortColumns = (width: number, columns: number[]): number[] =>
  map(
    sortCandidates(
      width,
      1,
      map(columns, (column) => ({ row: 3, column })),
      'HORIZONTAL',
    ),
    'column',
  );

const sortRows = (height: number, rows: number[]): number[] =>
  map(
    sortCandidates(
      3,
      height,
      map(rows, (row) => ({ row, column: 0 })),
      'VERTICAL',
    ),
    'row',
  );

describe('sortKeyCandidates', () => {
  it('should put the seam between the middle structures first in a horizontal level when all columns are free', () => {
    expect(sortColumns(60, range(60))[0]).toBe(20);
  });

  it('should put the columns nearest the seam first in a horizontal level when it gets columns on both sides', () => {
    expect(sortColumns(60, [0, 40, 21, 20, 19])).toEqual([20, 19, 21, 0, 40]);
  });

  it('should put the seam on a whole structure in a horizontal level when half the width falls inside one', () => {
    expect(sortColumns(90, range(90))[0]).toBe(40);
  });

  it('should put the left edge first in a horizontal level when it is one structure wide', () => {
    expect(sortColumns(20, [5, 0, 3])).toEqual([0, 3, 5]);
  });

  it('should put the left column first in a horizontal level when two columns are as far from the seam', () => {
    expect(
      sortCandidates(
        60,
        1,
        [
          { row: 1, column: 21 },
          { row: 4, column: 19 },
        ],
        'HORIZONTAL',
      ),
    ).toEqual([
      { row: 4, column: 19 },
      { row: 1, column: 21 },
    ]);
  });

  it('should put the candidate nearest the middle row first in a vertical level when the candidates are on different rows', () => {
    expect(sortRows(10, [1, 8, 5, 3])).toEqual([5, 3, 8, 1]);
  });

  it('should keep the old order in a vertical level when two candidates are as far from the middle row', () => {
    expect(
      sortCandidates(
        3,
        10,
        [
          { row: 7, column: 2 },
          { row: 3, column: 0 },
          { row: 7, column: 1 },
        ],
        'VERTICAL',
      ),
    ).toEqual([
      { row: 7, column: 2 },
      { row: 3, column: 0 },
      { row: 7, column: 1 },
    ]);
  });

  it('should give nothing back in a horizontal level when there are no candidates', () => {
    expect(sortCandidates(60, 1, [], 'HORIZONTAL')).toEqual([]);
  });

  it('should give nothing back in a vertical level when there are no candidates', () => {
    expect(sortCandidates(3, 10, [], 'VERTICAL')).toEqual([]);
  });

  it('should keep the grid the same when it sorts', () => {
    const tiles = createLevel(3, 3);

    expect(
      sortKeyCandidates({ tiles, levelType: 'HORIZONTAL', candidates: [] })
        .tiles,
    ).toBe(tiles);
  });
});
