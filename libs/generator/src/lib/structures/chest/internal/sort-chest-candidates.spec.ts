import { TILE_AIR, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Spot } from '../../find-standing-spots';
import type { LevelType } from '../../get-level-type';
import { sortChestCandidates } from './sort-chest-candidates';

const LEVEL: Tile[][] = [[TILE_AIR]];

const sortCandidates = (candidates: Spot[], levelType: LevelType) =>
  sortChestCandidates({ tiles: LEVEL, levelType, candidates }).candidates;

describe('sortChestCandidates', () => {
  it('should put the rightmost column first in a horizontal level when it gets many', () => {
    expect(
      map(
        sortCandidates(
          map([0, 3, 1], (column) => ({ row: 2, column })),
          'HORIZONTAL',
        ),
        'column',
      ),
    ).toEqual([3, 1, 0]);
  });

  it('should keep the row of each candidate in a horizontal level when it sorts', () => {
    expect(
      sortCandidates(
        [
          { row: 4, column: 1 },
          { row: 2, column: 3 },
        ],
        'HORIZONTAL',
      ),
    ).toEqual([
      { row: 2, column: 3 },
      { row: 4, column: 1 },
    ]);
  });

  it('should put the highest candidate first in a vertical level when the candidates are on different rows', () => {
    expect(
      map(
        sortCandidates(
          map([5, 3, 8], (row) => ({ row, column: 0 })),
          'VERTICAL',
        ),
        'row',
      ),
    ).toEqual([3, 5, 8]);
  });

  it('should keep the old order in a vertical level when the candidates are on the same row', () => {
    expect(
      sortCandidates(
        [
          { row: 3, column: 2 },
          { row: 3, column: 0 },
        ],
        'VERTICAL',
      ),
    ).toEqual([
      { row: 3, column: 2 },
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
      sortChestCandidates({
        tiles: LEVEL,
        levelType: 'HORIZONTAL',
        candidates: [],
      }).tiles,
    ).toBe(LEVEL);
  });
});
