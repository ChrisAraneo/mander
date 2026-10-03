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

import { createUnderpinPatches } from './create-underpin-patches';

const createLayer = (bottom: Tile[]): Tile[][] => [
  ...times(STRUCTURE_HEIGHT - 1, () => map(bottom, (): Tile => TILE_AIR)),
  bottom,
];

const createLevel = (height: number, width: number): Tile[][] =>
  times(height, () => times(width, (): Tile => TILE_AIR));

describe('createUnderpinPatches', () => {
  it('should prop the bottom row up to the floor of the grid when the structure hangs above it', () => {
    expect(
      createUnderpinPatches(createLevel(STRUCTURE_HEIGHT + 2, 2), [
        { layer: createLayer([TILE_DIRT, TILE_STONE]), row: 0, column: 0 },
      ]),
    ).toEqual([
      { row: STRUCTURE_HEIGHT, column: 0, tile: TILE_DIRT },
      { row: STRUCTURE_HEIGHT + 1, column: 0, tile: TILE_DIRT },
      { row: STRUCTURE_HEIGHT, column: 1, tile: TILE_STONE },
      { row: STRUCTURE_HEIGHT + 1, column: 1, tile: TILE_STONE },
    ]);
  });

  it('should prop up only the solid tiles of the bottom row when some are not solid', () => {
    expect(
      createUnderpinPatches(createLevel(STRUCTURE_HEIGHT + 1, 2), [
        { layer: createLayer([TILE_DIRT, TILE_SPIKE]), row: 0, column: 0 },
      ]),
    ).toEqual([{ row: STRUCTURE_HEIGHT, column: 0, tile: TILE_DIRT }]);
  });

  it('should prop the structure up from where it sits when it is placed lower down', () => {
    expect(
      createUnderpinPatches(createLevel(STRUCTURE_HEIGHT + 2, 3), [
        { layer: createLayer([TILE_DIRT]), row: 1, column: 2 },
      ]),
    ).toEqual([{ row: STRUCTURE_HEIGHT + 1, column: 2, tile: TILE_DIRT }]);
  });

  it('should leave a spot alone when the grid is already filled there', () => {
    const tiles = createLevel(STRUCTURE_HEIGHT + 2, 1);
    tiles[STRUCTURE_HEIGHT + 1][0] = TILE_BRICK;

    expect(
      createUnderpinPatches(tiles, [
        { layer: createLayer([TILE_DIRT]), row: 0, column: 0 },
      ]),
    ).toEqual([{ row: STRUCTURE_HEIGHT, column: 0, tile: TILE_DIRT }]);
  });

  it('should prop a spot up from the first structure when two structures would prop it', () => {
    expect(
      createUnderpinPatches(createLevel(STRUCTURE_HEIGHT + 1, 1), [
        { layer: createLayer([TILE_DIRT]), row: 0, column: 0 },
        { layer: createLayer([TILE_STONE]), row: 0, column: 0 },
      ]),
    ).toEqual([{ row: STRUCTURE_HEIGHT, column: 0, tile: TILE_DIRT }]);
  });

  it('should make no marks when the structure already reaches the floor of the grid', () => {
    expect(
      createUnderpinPatches(createLevel(STRUCTURE_HEIGHT, 1), [
        { layer: createLayer([TILE_DIRT]), row: 0, column: 0 },
      ]),
    ).toEqual([]);
  });

  it('should make no marks when there are no layers', () => {
    expect(
      createUnderpinPatches(createLevel(STRUCTURE_HEIGHT + 1, 1), []),
    ).toEqual([]);
  });
});
