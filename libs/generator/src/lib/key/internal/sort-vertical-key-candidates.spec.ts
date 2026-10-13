import { TILE_AIR, type Tile } from '@mander/model';
import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { sortVerticalKeyCandidates } from './sort-vertical-key-candidates';

const createLevel = (height: number): Tile[][] =>
  times(height, () => times(3, () => TILE_AIR));

const sortRows = (height: number, rows: number[]): number[] =>
  map(
    sortVerticalKeyCandidates(
      createLevel(height),
      map(rows, (row) => ({ row, column: 0 })),
    ),
    (candidate) => candidate.row,
  );

describe('sortVerticalKeyCandidates', () => {
  it('should put the candidate nearest the middle row first when the candidates are on different rows', () => {
    expect(sortRows(10, [1, 8, 5, 3])).toEqual([5, 3, 8, 1]);
  });

  it('should keep the old order when two candidates are as far from the middle row', () => {
    expect(
      sortVerticalKeyCandidates(createLevel(10), [
        { row: 7, column: 2 },
        { row: 3, column: 0 },
        { row: 7, column: 1 },
      ]),
    ).toEqual([
      { row: 7, column: 2 },
      { row: 3, column: 0 },
      { row: 7, column: 1 },
    ]);
  });

  it('should give nothing back when there are no candidates', () => {
    expect(sortRows(10, [])).toEqual([]);
  });
});
