import { TILE_AIR, TILE_BRICK } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { sliceRowsAfter } from './slice-rows-after';

const ROWS = [
  { cells: [TILE_AIR], at: 6 },
  { cells: [TILE_BRICK], at: 30 },
];

describe('sliceRowsAfter', () => {
  it('should give the cells of the rows that start after the boundary when some do', () => {
    expect(sliceRowsAfter(ROWS, 20)).toEqual([[TILE_BRICK]]);
  });

  it('should give no rows when there are no rows', () => {
    expect(sliceRowsAfter([], 20)).toEqual([]);
  });
});
