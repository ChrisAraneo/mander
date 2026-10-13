import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { filterStandingSurfaceSpots } from './filter-standing-surface-spots';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

describe('filterStandingSurfaceSpots', () => {
  it('should give the top block of each column when there is room above it', () => {
    expect(filterStandingSurfaceSpots(createGrid(['..', '##']), 1)).toEqual([
      { row: 1, column: 0 },
      { row: 1, column: 1 },
    ]);
  });

  it('should keep the ledge and leave out the floor under it when a column has both', () => {
    expect(
      filterStandingSurfaceSpots(createGrid(['...', '.#.', '...', '###']), 1),
    ).toEqual([
      { row: 1, column: 1 },
      { row: 3, column: 0 },
      { row: 3, column: 2 },
    ]);
  });

  it('should skip a column when something is in the way above its top block', () => {
    expect(
      filterStandingSurfaceSpots(createGrid(['..', 'o.', '##']), 1),
    ).toEqual([{ row: 2, column: 1 }]);
  });

  it('should skip a column when there is less room above its top block than the clearance', () => {
    expect(
      filterStandingSurfaceSpots(createGrid(['..', '#.', '..', '##']), 2),
    ).toEqual([{ row: 3, column: 1 }]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(filterStandingSurfaceSpots([], 1)).toEqual([]);
  });
});
