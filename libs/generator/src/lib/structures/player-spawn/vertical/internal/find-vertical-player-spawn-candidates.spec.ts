import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findVerticalPlayerSpawnCandidates } from './find-vertical-player-spawn-candidates';

const grid = (rows: string[]): Tile[][] =>
  map(rows, (row) =>
    map([...row], (cell) => (cell === '#' ? TILE_DIRT : TILE_AIR)),
  );

// the upper floor has four rows of air above it, the lower one only two
const TWO_FLOORS = grid([
  '...',
  '...',
  '...',
  '...',
  '###',
  '...',
  '...',
  '###',
]);

describe('findVerticalPlayerSpawnCandidates', () => {
  it('should give the candidates with room for the player to stand up when there are some', () => {
    expect(findVerticalPlayerSpawnCandidates(TWO_FLOORS).candidates).toEqual([
      { row: 4, column: 0 },
      { row: 4, column: 1 },
      { row: 4, column: 2 },
    ]);
  });

  it('should give the candidates just tall enough for the spawn when none have more room', () => {
    expect(
      findVerticalPlayerSpawnCandidates(grid(['...', '...', '#.#'])).candidates,
    ).toEqual([
      { row: 2, column: 0 },
      { row: 2, column: 2 },
    ]);
  });

  it('should give no candidates when there is nowhere to stand', () => {
    expect(
      findVerticalPlayerSpawnCandidates(grid(['...', '...', '...'])).candidates,
    ).toEqual([]);
  });

  it('should give no candidates when the grid is empty', () => {
    expect(findVerticalPlayerSpawnCandidates([]).candidates).toEqual([]);
  });

  it('should keep the grid the same when it looks for candidates', () => {
    expect(findVerticalPlayerSpawnCandidates(TWO_FLOORS).tiles).toBe(
      TWO_FLOORS,
    );
  });
});
