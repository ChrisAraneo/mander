import { TILE_AIR, TILE_BRICK } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { sliceRowsBefore } from './slice-rows-before';

const ROWS = [
  { cells: [TILE_AIR], at: 6 },
  { cells: [TILE_BRICK], at: 30 },
];

describe('sliceRowsBefore', () => {
  it('should give the cells of the rows that start before the boundary when some do', () => {
    expect(sliceRowsBefore(ROWS, 20)).toEqual([[TILE_AIR]]);
  });

  it('should give no rows when there are no rows', () => {
    expect(sliceRowsBefore([], 20)).toEqual([]);
  });
});
