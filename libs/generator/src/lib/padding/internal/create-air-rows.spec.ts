import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createAirRows } from './create-air-rows';

const ROW: Tile[] = [TILE_DIRT, TILE_AIR, TILE_DIRT];

describe('createAirRows', () => {
  it('should make rows of air as wide as the row when it is asked for some', () => {
    expect(createAirRows(ROW, 2)).toEqual([
      [TILE_AIR, TILE_AIR, TILE_AIR],
      [TILE_AIR, TILE_AIR, TILE_AIR],
    ]);
  });

  it('should make a row of its own for every row when it makes several', () => {
    const rows = createAirRows(ROW, 2);

    expect(rows[0]).not.toBe(rows[1]);
  });

  it('should make no rows when it is asked for none', () => {
    expect(createAirRows(ROW, 0)).toEqual([]);
  });

  it('should make empty rows when the row is empty', () => {
    expect(createAirRows([], 2)).toEqual([[], []]);
  });
});
