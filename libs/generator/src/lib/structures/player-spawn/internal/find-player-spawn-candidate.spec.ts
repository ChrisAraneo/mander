import { TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { findPlayerSpawnCandidate } from './find-player-spawn-candidate';

const LEVEL: Tile[][] = [[TILE_DIRT]];

describe('findPlayerSpawnCandidate', () => {
  it('should pick the first column with rows when many columns have rows', () => {
    expect(
      findPlayerSpawnCandidate({
        tiles: LEVEL,
        candidates: [
          { column: 1, rows: [3, 2] },
          { column: 2, rows: [5, 4] },
        ],
      }).found,
    ).toEqual({ column: 1, rows: [3, 2] });
  });

  it('should skip the empty columns when the first ones have no rows', () => {
    expect(
      findPlayerSpawnCandidate({
        tiles: LEVEL,
        candidates: [
          { column: 1, rows: [] },
          { column: 2, rows: [] },
          { column: 0, rows: [3, 2] },
        ],
      }).found,
    ).toEqual({ column: 0, rows: [3, 2] });
  });

  it('should pick nothing when no column has rows', () => {
    expect(
      findPlayerSpawnCandidate({
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
      findPlayerSpawnCandidate({ tiles: LEVEL, candidates: [] }).found,
    ).toBeUndefined();
  });

  it('should keep the grid the same when it picks a column', () => {
    expect(
      findPlayerSpawnCandidate({ tiles: LEVEL, candidates: [] }).tiles,
    ).toBe(LEVEL);
  });
});
