import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findValidPortalRows } from './find-valid-portal-rows';

const grid = (rows: string[]): Tile[][] =>
  map(rows, (row) =>
    map([...row], (cell) =>
      // '#' is ground, 'o' is a gem: not solid, but not empty either
      cell === '#' ? TILE_DIRT : cell === 'o' ? TILE_GEM : TILE_AIR,
    ),
  );

// column 0 is clear, 1 has a gem in the way, 2 has no room above its ledge,
// and 3 has no floor at all
const LEVEL = grid(['....', '.o#.', '....', '###.']);

describe('findValidPortalRows', () => {
  it('should give the rows above the floor when both rows are empty', () => {
    expect(findValidPortalRows(LEVEL, 0)).toEqual([2, 1]);
  });

  it('should give nothing when something is already in one of the rows', () => {
    expect(findValidPortalRows(LEVEL, 1)).toEqual([]);
  });

  it('should give nothing when there is not enough space above the floor', () => {
    expect(findValidPortalRows(LEVEL, 2)).toEqual([]);
  });

  it('should give nothing when the column has no floor to stand on', () => {
    expect(findValidPortalRows(LEVEL, 3)).toEqual([]);
  });

  it('should give nothing when the grid is empty', () => {
    expect(findValidPortalRows([], 0)).toEqual([]);
  });
});
