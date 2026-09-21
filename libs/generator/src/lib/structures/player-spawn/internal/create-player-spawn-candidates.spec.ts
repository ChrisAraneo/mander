import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createPlayerSpawnCandidates } from './create-player-spawn-candidates';

const grid = (rows: string[]): Tile[][] =>
  map(rows, (row) =>
    map([...row], (cell) => (cell === '#' ? TILE_DIRT : TILE_AIR)),
  );

// columns 0 and 1 can hold a spawn, column 2 has no floor under it
const LEVEL = grid(['...', '...', '##.']);

describe('createPlayerSpawnCandidates', () => {
  it('should give the rows above the floor when the column has space', () => {
    expect(
      createPlayerSpawnCandidates({ tiles: LEVEL, columns: [0] }).candidates,
    ).toEqual([{ column: 0, rows: [1, 0] }]);
  });

  it('should give no rows when the column has no space', () => {
    expect(
      createPlayerSpawnCandidates({ tiles: LEVEL, columns: [2] }).candidates,
    ).toEqual([{ column: 2, rows: [] }]);
  });

  it('should keep the columns in the same order when it makes the list', () => {
    expect(
      map(
        createPlayerSpawnCandidates({ tiles: LEVEL, columns: [2, 0, 1] })
          .candidates,
        'column',
      ),
    ).toEqual([2, 0, 1]);
  });

  it('should make one item per column when it gets many columns', () => {
    expect(
      createPlayerSpawnCandidates({ tiles: LEVEL, columns: [0, 1, 2] })
        .candidates,
    ).toHaveLength(3);
  });

  it('should make an empty list when there are no columns', () => {
    expect(
      createPlayerSpawnCandidates({ tiles: LEVEL, columns: [] }).candidates,
    ).toEqual([]);
  });

  it('should keep the grid the same when it makes the list', () => {
    expect(
      createPlayerSpawnCandidates({ tiles: LEVEL, columns: [] }).tiles,
    ).toBe(LEVEL);
  });
});
