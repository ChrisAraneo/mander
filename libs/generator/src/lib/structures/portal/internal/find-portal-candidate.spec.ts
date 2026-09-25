import { TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { findPortalCandidate } from './find-portal-candidate';

const LEVEL: Tile[][] = [[TILE_DIRT]];

describe('findPortalCandidate', () => {
  it('should pick the first column with rows when many columns have rows', () => {
    expect(
      findPortalCandidate({
        tiles: LEVEL,
        candidates: [
          { column: 4, rows: [3, 2] },
          { column: 3, rows: [5, 4] },
        ],
      }).found,
    ).toEqual({ column: 4, rows: [3, 2] });
  });

  it('should skip the empty columns when the first ones have no rows', () => {
    expect(
      findPortalCandidate({
        tiles: LEVEL,
        candidates: [
          { column: 4, rows: [] },
          { column: 3, rows: [] },
          { column: 5, rows: [3, 2] },
        ],
      }).found,
    ).toEqual({ column: 5, rows: [3, 2] });
  });

  it('should pick nothing when no column has rows', () => {
    expect(
      findPortalCandidate({
        tiles: LEVEL,
        candidates: [
          { column: 0, rows: [] },
          { column: 1, rows: [] },
        ],
      }).found,
    ).toBeUndefined();
  });

  it('should pick nothing when the list is empty', () => {
    expect(
      findPortalCandidate({ tiles: LEVEL, candidates: [] }).found,
    ).toBeUndefined();
  });

  it('should keep the grid the same when it picks a column', () => {
    expect(findPortalCandidate({ tiles: LEVEL, candidates: [] }).tiles).toBe(
      LEVEL,
    );
  });
});
