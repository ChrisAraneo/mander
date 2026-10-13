import { TILE_AIR, type Tile } from '@mander/model';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { sortVerticalPortalCandidates } from './sort-vertical-portal-candidates';

const LEVEL: Tile[][] = [times(5, () => TILE_AIR)];

describe('sortVerticalPortalCandidates', () => {
  it('should put the highest candidate first when the candidates are on different rows', () => {
    expect(
      sortVerticalPortalCandidates(LEVEL, [
        { row: 9, column: 2 },
        { row: 2, column: 0 },
        { row: 5, column: 2 },
      ]),
    ).toEqual([
      { row: 2, column: 0 },
      { row: 5, column: 2 },
      { row: 9, column: 2 },
    ]);
  });

  it('should put the candidate nearest the middle column first when two candidates share the highest row', () => {
    expect(
      sortVerticalPortalCandidates(LEVEL, [
        { row: 2, column: 4 },
        { row: 2, column: 2 },
      ]),
    ).toEqual([
      { row: 2, column: 2 },
      { row: 2, column: 4 },
    ]);
  });

  it('should give nothing back when there are no candidates', () => {
    expect(sortVerticalPortalCandidates(LEVEL, [])).toEqual([]);
  });
});
