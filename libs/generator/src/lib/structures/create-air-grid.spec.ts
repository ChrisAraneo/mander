import { TILE_AIR } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createAirGrid } from './create-air-grid';

describe('createAirGrid', () => {
  it('should fill every spot with air when it makes a grid', () => {
    expect(createAirGrid(2, 3)).toEqual([
      [TILE_AIR, TILE_AIR, TILE_AIR],
      [TILE_AIR, TILE_AIR, TILE_AIR],
    ]);
  });

  it('should make a row of its own for every row when it makes a grid', () => {
    const tiles = createAirGrid(2, 3);

    expect(tiles[0]).not.toBe(tiles[1]);
  });

  it('should make an empty grid when the height is zero', () => {
    expect(createAirGrid(0, 3)).toEqual([]);
  });
});
