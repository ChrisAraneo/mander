import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findHorizontalPlayerSpawnCandidates } from './find-horizontal-player-spawn-candidates';

const grid = (rows: string[]): Tile[][] =>
  map(rows, (row) =>
    map([...row], (cell) =>
      // '#' is ground, 'o' is a gem: not solid, but not empty either
      cell === '#' ? TILE_DIRT : cell === 'o' ? TILE_GEM : TILE_AIR,
    ),
  );

const candidates = (rows: string[]) =>
  findHorizontalPlayerSpawnCandidates(grid(rows)).candidates;

describe('findHorizontalPlayerSpawnCandidates', () => {
  it('should give the top block of each column when there is room above it', () => {
    expect(candidates(['..', '..', '##'])).toEqual([
      { row: 2, column: 0 },
      { row: 2, column: 1 },
    ]);
  });

  it('should stand on the ledge and not the floor under it when a column has both', () => {
    expect(candidates(['...', '...', '.#.', '...', '...', '###'])).toEqual([
      { row: 2, column: 1 },
      { row: 5, column: 0 },
      { row: 5, column: 2 },
    ]);
  });

  it('should skip a column when a block hangs over its floor', () => {
    expect(candidates(['#..', '...', '...', '###'])).toEqual([
      { row: 3, column: 1 },
      { row: 3, column: 2 },
    ]);
  });

  it('should skip a column when something is in the way above its top block', () => {
    expect(candidates(['..', 'o.', '##'])).toEqual([{ row: 2, column: 1 }]);
  });

  it('should give no candidates when there is nothing to stand on', () => {
    expect(candidates(['..', '..'])).toEqual([]);
  });

  it('should give no candidates when the grid is empty', () => {
    expect(candidates([])).toEqual([]);
  });

  it('should keep the grid the same when it looks for candidates', () => {
    const tiles = grid(['..', '..', '##']);

    expect(findHorizontalPlayerSpawnCandidates(tiles).tiles).toBe(tiles);
  });
});
