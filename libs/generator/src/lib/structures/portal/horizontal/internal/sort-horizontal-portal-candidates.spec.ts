import { TILE_AIR, type Tile } from '@mander/model';
import { map, range, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { sortHorizontalPortalCandidates } from './sort-horizontal-portal-candidates';

const level = (width: number): Tile[][] => [times(width, () => TILE_AIR)];

const sorted = (width: number, columns: number[]): number[] =>
  map(
    sortHorizontalPortalCandidates({
      tiles: level(width),
      candidates: map(columns, (column) => ({ row: 3, column })),
    }).candidates,
    'column',
  );

describe('sortHorizontalPortalCandidates', () => {
  it('should put the second column from the right first when all columns are free', () => {
    expect(sorted(6, range(6))[0]).toBe(4);
  });

  it('should put the columns near the right edge first when the level is six wide', () => {
    expect(sorted(6, range(6))).toEqual([4, 3, 2, 5, 1, 0]);
  });

  it('should put the far left columns last when the level is wider than four', () => {
    expect(sorted(8, range(8))).toEqual([6, 5, 4, 7, 3, 2, 1, 0]);
  });

  it('should count from the right edge of the grid when the level is wider', () => {
    expect(sorted(10, [6, 7, 8, 9])).toEqual([8, 7, 6, 9]);
  });

  it('should sort the far columns from right to left when it only gets far columns', () => {
    expect(sorted(10, [0, 2, 1])).toEqual([2, 1, 0]);
  });

  it('should sort only the columns it gets when some are missing', () => {
    expect(sorted(6, [0, 5, 3])).toEqual([3, 5, 0]);
  });

  it('should keep the row of each candidate when it sorts', () => {
    expect(
      sortHorizontalPortalCandidates({
        tiles: level(6),
        candidates: [
          { row: 4, column: 3 },
          { row: 2, column: 4 },
        ],
      }).candidates,
    ).toEqual([
      { row: 2, column: 4 },
      { row: 4, column: 3 },
    ]);
  });

  it('should give nothing back when there are no candidates', () => {
    expect(sorted(6, [])).toEqual([]);
  });

  it('should keep the grid the same when it sorts', () => {
    const tiles = level(3);

    expect(
      sortHorizontalPortalCandidates({ tiles, candidates: [] }).tiles,
    ).toBe(tiles);
  });
});
