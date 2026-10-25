import {
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_STONE,
  type Tile,
} from '@mander/model';
import { STRUCTURE_HEIGHT } from '@mander/structures';
import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createLayerUnderpinPatches } from './create-layer-underpin-patches';

const createLayer = (bottom: Tile[]): Tile[][] => [
  ...times(STRUCTURE_HEIGHT - 1, () => map(bottom, (): Tile => TILE_AIR)),
  bottom,
];

const createLevel = (height: number, width: number): Tile[][] =>
  times(height, () => times(width, (): Tile => TILE_AIR));

describe('createLayerUnderpinPatches', () => {
  it('should prop each solid tile of the bottom row down to the floor when the layer hangs above it', () => {
    expect(
      createLayerUnderpinPatches(createLevel(STRUCTURE_HEIGHT + 2, 2), {
        layer: createLayer([TILE_DIRT, TILE_STONE]),
        row: 0,
        column: 0,
      }),
    ).toEqual([
      { row: STRUCTURE_HEIGHT, column: 0, tile: TILE_DIRT },
      { row: STRUCTURE_HEIGHT + 1, column: 0, tile: TILE_DIRT },
      { row: STRUCTURE_HEIGHT, column: 1, tile: TILE_STONE },
      { row: STRUCTURE_HEIGHT + 1, column: 1, tile: TILE_STONE },
    ]);
  });

  it('should leave out the tiles that are not solid when the bottom row holds some', () => {
    expect(
      createLayerUnderpinPatches(createLevel(STRUCTURE_HEIGHT + 1, 2), {
        layer: createLayer([TILE_SPIKE, TILE_DIRT]),
        row: 0,
        column: 0,
      }),
    ).toEqual([{ row: STRUCTURE_HEIGHT, column: 1, tile: TILE_DIRT }]);
  });

  it('should start below where the layer sits when it is placed lower and further right', () => {
    expect(
      createLayerUnderpinPatches(createLevel(STRUCTURE_HEIGHT + 2, 3), {
        layer: createLayer([TILE_DIRT]),
        row: 1,
        column: 2,
      }),
    ).toEqual([{ row: STRUCTURE_HEIGHT + 1, column: 2, tile: TILE_DIRT }]);
  });

  it('should leave a spot alone when the grid is already filled there', () => {
    const tiles = createLevel(STRUCTURE_HEIGHT + 2, 1);
    tiles[STRUCTURE_HEIGHT][0] = TILE_BRICK;

    expect(
      createLayerUnderpinPatches(tiles, {
        layer: createLayer([TILE_DIRT]),
        row: 0,
        column: 0,
      }),
    ).toEqual([{ row: STRUCTURE_HEIGHT + 1, column: 0, tile: TILE_DIRT }]);
  });

  it('should make no marks when the layer has no bottom row', () => {
    expect(
      createLayerUnderpinPatches(createLevel(STRUCTURE_HEIGHT + 1, 1), {
        layer: [],
        row: 0,
        column: 0,
      }),
    ).toEqual([]);
  });
});
