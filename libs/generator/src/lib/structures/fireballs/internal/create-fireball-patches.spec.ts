import {
  TILE_AIR,
  TILE_BRICK,
  TILE_FIREBALL,
  TILE_STONE,
  type Tile,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createFireballPatches } from './create-fireball-patches';

const LEVEL: Tile[][] = [
  [TILE_AIR, TILE_STONE, TILE_AIR],
  [TILE_AIR, TILE_FIREBALL, TILE_FIREBALL],
];

describe('createFireballPatches', () => {
  it('should mark the spot with the blocks around it when it gets spots', () => {
    expect(
      createFireballPatches({ tiles: LEVEL, cells: [{ row: 1, column: 1 }] })
        .patches,
    ).toEqual([{ row: 1, column: 1, tile: TILE_STONE }]);
  });

  it('should read the neighbours from the old grid when it marks many spots', () => {
    expect(
      createFireballPatches({
        tiles: LEVEL,
        cells: [
          { row: 1, column: 1 },
          { row: 1, column: 2 },
        ],
      }).patches,
    ).toEqual([
      { row: 1, column: 1, tile: TILE_STONE },
      { row: 1, column: 2, tile: TILE_STONE },
    ]);
  });

  it('should mark the spot with a brick when no block stands near', () => {
    expect(
      createFireballPatches({
        tiles: [[TILE_FIREBALL]],
        cells: [{ row: 0, column: 0 }],
      }).patches,
    ).toEqual([{ row: 0, column: 0, tile: TILE_BRICK }]);
  });

  it('should make no marks when it gets no spots', () => {
    expect(createFireballPatches({ tiles: LEVEL, cells: [] }).patches).toEqual(
      [],
    );
  });

  it('should keep the grid the same when it makes the marks', () => {
    expect(createFireballPatches({ tiles: LEVEL, cells: [] }).tiles).toBe(
      LEVEL,
    );
  });
});
