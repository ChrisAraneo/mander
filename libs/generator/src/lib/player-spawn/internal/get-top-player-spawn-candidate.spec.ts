import { TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { getTopPlayerSpawnCandidate } from './get-top-player-spawn-candidate';

const LEVEL: Tile[][] = [[TILE_DIRT]];

describe('getTopPlayerSpawnCandidate', () => {
  it('should pick the first candidate when there are many', () => {
    expect(
      getTopPlayerSpawnCandidate({
        tiles: LEVEL,
        candidates: [
          { row: 3, column: 1 },
          { row: 5, column: 4 },
        ],
      }).candidate,
    ).toEqual({ row: 3, column: 1 });
  });

  it('should pick nothing when there are no candidates', () => {
    expect(
      getTopPlayerSpawnCandidate({ tiles: LEVEL, candidates: [] }).candidate,
    ).toBeUndefined();
  });

  it('should keep the grid the same when it picks a candidate', () => {
    expect(
      getTopPlayerSpawnCandidate({ tiles: LEVEL, candidates: [] }).tiles,
    ).toBe(LEVEL);
  });
});
