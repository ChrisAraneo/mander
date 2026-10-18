import { TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { getTopPortalCandidate } from './get-top-portal-candidate';

const LEVEL: Tile[][] = [[TILE_DIRT]];

describe('getTopPortalCandidate', () => {
  it('should pick the first candidate when there are many', () => {
    expect(
      getTopPortalCandidate({
        tiles: LEVEL,
        candidates: [
          { row: 3, column: 4 },
          { row: 5, column: 1 },
        ],
      }).candidate,
    ).toEqual({ row: 3, column: 4 });
  });

  it('should pick nothing when there are no candidates', () => {
    expect(
      getTopPortalCandidate({ tiles: LEVEL, candidates: [] }).candidate,
    ).toBeUndefined();
  });

  it('should keep the grid the same when it picks a candidate', () => {
    expect(getTopPortalCandidate({ tiles: LEVEL, candidates: [] }).tiles).toBe(
      LEVEL,
    );
  });
});
