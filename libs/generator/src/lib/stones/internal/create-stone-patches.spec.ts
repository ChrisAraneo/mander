import { TILE_DIRT, TILE_STONE, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createStonePatches } from './create-stone-patches';

const LEVEL: Tile[][] = [
  [TILE_DIRT, TILE_DIRT],
  [TILE_DIRT, TILE_DIRT],
];

describe('createStonePatches', () => {
  it('should mark the stone spots with stone when it gets stones', () => {
    expect(
      createStonePatches({
        tiles: LEVEL,
        cells: [
          [0, 1],
          [1, 0],
        ],
      }).patches,
    ).toEqual([
      { row: 0, column: 1, tile: TILE_STONE },
      { row: 1, column: 0, tile: TILE_STONE },
    ]);
  });

  it('should make no marks when there are no stones', () => {
    expect(
      createStonePatches({
        tiles: LEVEL,
        cells: [
          [0, 0],
          [0, 0],
        ],
      }).patches,
    ).toEqual([]);
  });

  it('should keep the grid the same when it makes the marks', () => {
    expect(createStonePatches({ tiles: LEVEL, cells: [] }).tiles).toBe(LEVEL);
  });
});
