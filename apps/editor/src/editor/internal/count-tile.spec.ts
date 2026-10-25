import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { countTile } from './count-tile';

describe('countTile', () => {
  it('should count the cells of the tile across all rows when the grid holds some', () => {
    expect(
      countTile(
        [
          [TILE_DIRT, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ],
        TILE_DIRT,
      ),
    ).toBe(3);
  });

  it('should give zero when the grid is empty', () => {
    expect(countTile([], TILE_DIRT)).toBe(0);
  });
});
