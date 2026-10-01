import { TILE_KEY, TILE_PORTAL } from '@mander/model';
import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { standTiles } from './stand-tiles';

describe('standTiles', () => {
  it('should mark the rows above the spot when it stands a tile there', () => {
    expect(standTiles({ row: 5, column: 2 }, TILE_PORTAL, 2)).toEqual([
      { row: 4, column: 2, tile: TILE_PORTAL },
      { row: 3, column: 2, tile: TILE_PORTAL },
    ]);
  });

  it('should make as many marks as the height when it stands a tall tile', () => {
    expect(size(standTiles({ row: 9, column: 0 }, TILE_KEY, 4))).toBe(4);
  });

  it('should make no marks when the height is zero', () => {
    expect(standTiles({ row: 5, column: 2 }, TILE_KEY, 0)).toEqual([]);
  });
});
