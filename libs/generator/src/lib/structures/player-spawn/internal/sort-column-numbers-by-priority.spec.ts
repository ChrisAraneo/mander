import { TILE_DIRT, type Tile } from '@mander/model';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { sortColumnNumbersByPriority } from './sort-column-numbers-by-priority';

const LEVEL: Tile[][] = [[TILE_DIRT]];

const sorted = (columns: number[]): number[] =>
  sortColumnNumbersByPriority({ tiles: LEVEL, columns }).columns;

describe('sortColumnNumbersByPriority', () => {
  it('should put column 1 first when all columns are free', () => {
    expect(sorted(times(6, (index) => index))[0]).toBe(1);
  });

  it('should put the columns near the left edge first when the level is six wide', () => {
    expect(sorted(times(6, (index) => index))).toEqual([1, 2, 3, 0, 4, 5]);
  });

  it('should put the far columns last when the level is wider than six', () => {
    expect(sorted(times(8, (index) => index))).toEqual([
      1, 2, 3, 0, 4, 5, 6, 7,
    ]);
  });

  it('should sort the far columns from left to right when it only gets far columns', () => {
    expect(sorted([8, 6, 7])).toEqual([6, 7, 8]);
  });

  it('should sort only the columns it gets when some are missing', () => {
    expect(sorted([5, 3, 0])).toEqual([3, 0, 5]);
  });

  it('should give nothing back when there are no columns', () => {
    expect(sorted([])).toEqual([]);
  });

  it('should keep the grid the same when it sorts', () => {
    expect(
      sortColumnNumbersByPriority({ tiles: LEVEL, columns: [] }).tiles,
    ).toBe(LEVEL);
  });
});
