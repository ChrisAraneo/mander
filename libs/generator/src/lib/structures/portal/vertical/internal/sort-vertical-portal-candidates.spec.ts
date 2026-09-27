import { TILE_AIR, type Tile } from '@mander/model';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { sortVerticalPortalCandidates } from './sort-vertical-portal-candidates';

const LEVEL: Tile[][] = [times(5, () => TILE_AIR)];

const sorted = (candidates: { row: number; column: number }[]) =>
  sortVerticalPortalCandidates({ tiles: LEVEL, candidates }).candidates;

describe('sortVerticalPortalCandidates', () => {
  it('should put the highest candidate first when the candidates are on different rows', () => {
    expect(
      sorted([
        { row: 3, column: 2 },
        { row: 1, column: 0 },
      ]),
    ).toEqual([
      { row: 1, column: 0 },
      { row: 3, column: 2 },
    ]);
  });

  it('should put the candidate nearest the middle first when the candidates are on the same row', () => {
    expect(
      sorted([
        { row: 3, column: 0 },
        { row: 3, column: 3 },
        { row: 3, column: 2 },
      ]),
    ).toEqual([
      { row: 3, column: 2 },
      { row: 3, column: 3 },
      { row: 3, column: 0 },
    ]);
  });

  it('should keep the old order when two candidates are as far from the middle', () => {
    expect(
      sorted([
        { row: 3, column: 4 },
        { row: 3, column: 0 },
      ]),
    ).toEqual([
      { row: 3, column: 4 },
      { row: 3, column: 0 },
    ]);
  });

  it('should give nothing back when there are no candidates', () => {
    expect(sorted([])).toEqual([]);
  });

  it('should keep the grid the same when it sorts', () => {
    expect(
      sortVerticalPortalCandidates({ tiles: LEVEL, candidates: [] }).tiles,
    ).toBe(LEVEL);
  });
});
