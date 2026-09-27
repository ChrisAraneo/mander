import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { map, range, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Spot } from '../../find-standing-spots';
import type { LevelType } from '../../get-level-type';
import { sortPlayerSpawnCandidates } from './sort-player-spawn-candidates';

const LEVEL: Tile[][] = [[TILE_DIRT]];

const WIDE_LEVEL: Tile[][] = [times(5, () => TILE_AIR)];

const sortCandidates = (candidates: Spot[], levelType: LevelType) =>
  sortPlayerSpawnCandidates({ tiles: WIDE_LEVEL, levelType, candidates })
    .candidates;

const sortColumns = (columns: number[]): number[] =>
  map(
    sortPlayerSpawnCandidates({
      tiles: LEVEL,
      levelType: 'HORIZONTAL',
      candidates: map(columns, (column) => ({ row: 3, column })),
    }).candidates,
    'column',
  );

describe('sortPlayerSpawnCandidates', () => {
  it('should put column 1 first in a horizontal level when all columns are free', () => {
    expect(sortColumns(range(6))[0]).toBe(1);
  });

  it('should put the columns near the left edge first in a horizontal level when it is six wide', () => {
    expect(sortColumns(range(6))).toEqual([1, 2, 3, 0, 4, 5]);
  });

  it('should put the far columns last in a horizontal level when it is wider than six', () => {
    expect(sortColumns(range(8))).toEqual([1, 2, 3, 0, 4, 5, 6, 7]);
  });

  it('should sort the far columns from left to right in a horizontal level when it only gets far columns', () => {
    expect(sortColumns([8, 6, 7])).toEqual([6, 7, 8]);
  });

  it('should sort only the columns it gets in a horizontal level when some are missing', () => {
    expect(sortColumns([5, 3, 0])).toEqual([3, 0, 5]);
  });

  it('should keep the row of each candidate in a horizontal level when it sorts', () => {
    expect(
      sortCandidates(
        [
          { row: 4, column: 3 },
          { row: 2, column: 1 },
        ],
        'HORIZONTAL',
      ),
    ).toEqual([
      { row: 2, column: 1 },
      { row: 4, column: 3 },
    ]);
  });

  it('should put the lowest candidate first in a vertical level when the candidates are on different rows', () => {
    expect(
      sortCandidates(
        [
          { row: 1, column: 2 },
          { row: 3, column: 0 },
        ],
        'VERTICAL',
      ),
    ).toEqual([
      { row: 3, column: 0 },
      { row: 1, column: 2 },
    ]);
  });

  it('should put the candidate nearest the middle first in a vertical level when the candidates are on the same row', () => {
    expect(
      sortCandidates(
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
    expect(sortCandidates([], 'HORIZONTAL')).toEqual([]);
  });

  it('should give nothing back in a vertical level when there are no candidates', () => {
    expect(sortCandidates([], 'VERTICAL')).toEqual([]);
  });

  it('should keep the grid the same when it sorts', () => {
    expect(
      sortPlayerSpawnCandidates({
        tiles: LEVEL,
        levelType: 'HORIZONTAL',
        candidates: [],
      }).tiles,
    ).toBe(LEVEL);
  });
});
