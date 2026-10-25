import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { addMissingGridTiles } from './add-missing-grid-tiles';

describe('addMissingGridTiles', () => {
  it('should fill the missing cells with air when the grid is smaller than the size', () => {
    expect(addMissingGridTiles([[TILE_DIRT]], 2, 2)).toEqual([
      [TILE_DIRT, TILE_AIR],
      [TILE_AIR, TILE_AIR],
    ]);
  });

  it('should cut the grid to the size when it is larger', () => {
    expect(
      addMissingGridTiles(
        [
          [TILE_DIRT, TILE_DIRT],
          [TILE_DIRT, TILE_DIRT],
        ],
        1,
        1,
      ),
    ).toEqual([[TILE_DIRT]]);
  });

  it('should give an empty grid when the size has no rows', () => {
    expect(addMissingGridTiles([[TILE_DIRT]], 0, 1)).toEqual([]);
  });
});
