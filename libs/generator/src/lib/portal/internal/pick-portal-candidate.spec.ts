import { TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { pickPortalCandidate } from './pick-portal-candidate';

const LEVEL: Tile[][] = [[TILE_DIRT]];

describe('pickPortalCandidate', () => {
  it('should pick the first candidate when there are many', () => {
    expect(
      pickPortalCandidate({
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
      pickPortalCandidate({ tiles: LEVEL, candidates: [] }).candidate,
    ).toBeUndefined();
  });

  it('should keep the grid the same when it picks a candidate', () => {
    expect(pickPortalCandidate({ tiles: LEVEL, candidates: [] }).tiles).toBe(
      LEVEL,
    );
  });
});
