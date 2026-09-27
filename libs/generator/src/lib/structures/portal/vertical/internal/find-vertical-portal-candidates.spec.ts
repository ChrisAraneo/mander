import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findVerticalPortalCandidates } from './find-vertical-portal-candidates';

const grid = (rows: string[]): Tile[][] =>
  map(rows, (row) =>
    map([...row], (cell) =>
      cell === '#' ? TILE_DIRT : cell === 'o' ? TILE_GEM : TILE_AIR,
    ),
  );

const TWO_FLOORS = grid(['...', '...', '###', '...', '...', '###']);

describe('findVerticalPortalCandidates', () => {
  it('should give the candidates on every floor when the level has more than one', () => {
    expect(findVerticalPortalCandidates(TWO_FLOORS).candidates).toEqual([
      { row: 2, column: 0 },
      { row: 2, column: 1 },
      { row: 2, column: 2 },
      { row: 5, column: 0 },
      { row: 5, column: 1 },
      { row: 5, column: 2 },
    ]);
  });

  it('should skip a spot when something is in the way above it', () => {
    expect(
      findVerticalPortalCandidates(grid(['...', '.o.', '###'])).candidates,
    ).toEqual([
      { row: 2, column: 0 },
      { row: 2, column: 2 },
    ]);
  });

  it('should skip a spot when it has only one row of room above it', () => {
    expect(
      findVerticalPortalCandidates(grid(['.#.', '...', '###'])).candidates,
    ).toEqual([
      { row: 2, column: 0 },
      { row: 2, column: 2 },
    ]);
  });

  it('should give no candidates when there is nowhere to stand', () => {
    expect(
      findVerticalPortalCandidates(grid(['...', '...', '...'])).candidates,
    ).toEqual([]);
  });

  it('should give no candidates when the grid is empty', () => {
    expect(findVerticalPortalCandidates([]).candidates).toEqual([]);
  });

  it('should keep the grid the same when it looks for candidates', () => {
    expect(findVerticalPortalCandidates(TWO_FLOORS).tiles).toBe(TWO_FLOORS);
  });
});
