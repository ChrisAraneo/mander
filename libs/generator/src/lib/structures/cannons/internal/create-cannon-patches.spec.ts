import {
  TILE_AIR,
  TILE_BRICK,
  TILE_CANNON,
  TILE_STONE,
  type Tile,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createCannonPatches } from './create-cannon-patches';

const LEVEL: Tile[][] = [
  [TILE_AIR, TILE_STONE, TILE_AIR],
  [TILE_AIR, TILE_CANNON, TILE_AIR],
  [TILE_AIR, TILE_STONE, TILE_AIR],
];

describe('createCannonPatches', () => {
  it('should mark the spot with the blocks around it when it gets spots', () => {
    expect(
      createCannonPatches({ tiles: LEVEL, cells: [{ row: 1, column: 1 }] })
        .patches,
    ).toEqual([{ row: 1, column: 1, tile: TILE_STONE }]);
  });

  it('should mark the spot with a brick when no block stands around it', () => {
    expect(
      createCannonPatches({
        tiles: [[TILE_CANNON]],
        cells: [{ row: 0, column: 0 }],
      }).patches,
    ).toEqual([{ row: 0, column: 0, tile: TILE_BRICK }]);
  });

  it('should make no marks when it gets no spots', () => {
    expect(createCannonPatches({ tiles: LEVEL, cells: [] }).patches).toEqual(
      [],
    );
  });

  it('should keep the grid the same when it makes the marks', () => {
    expect(createCannonPatches({ tiles: LEVEL, cells: [] }).tiles).toBe(LEVEL);
  });
});
