import { TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { pickChestCandidate } from './pick-chest-candidate';

const LEVEL: Tile[][] = [[TILE_DIRT]];

describe('pickChestCandidate', () => {
  it('should pick the first candidate when there are many', () => {
    expect(
      pickChestCandidate({
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
      pickChestCandidate({ tiles: LEVEL, candidates: [] }).candidate,
    ).toBeUndefined();
  });

  it('should keep the grid the same when it picks a candidate', () => {
    expect(pickChestCandidate({ tiles: LEVEL, candidates: [] }).tiles).toBe(
      LEVEL,
    );
  });
});
