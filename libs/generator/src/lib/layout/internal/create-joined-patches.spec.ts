import { TILE_AIR, TILE_BRICK, TILE_DIRT, type Tile } from '@mander/model';
import { STRUCTURE_HEIGHT } from '@mander/structures';
import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createJoinedPatches } from './create-joined-patches';

const createLayer = (bottom: Tile[]): Tile[][] => [
  ...times(STRUCTURE_HEIGHT - 1, () => map(bottom, (): Tile => TILE_AIR)),
  bottom,
];

const createLevel = (height: number, width: number): Tile[][] =>
  times(height, () => times(width, (): Tile => TILE_AIR));

describe('createJoinedPatches', () => {
  it('should paint the layer and prop it up to the floor when it joins a structure', () => {
    expect(
      createJoinedPatches(createLevel(STRUCTURE_HEIGHT + 1, 1), [
        { layer: createLayer([TILE_DIRT]), row: 0, column: 0 },
      ]),
    ).toEqual([
      { row: STRUCTURE_HEIGHT - 1, column: 0, tile: TILE_DIRT },
      { row: STRUCTURE_HEIGHT, column: 0, tile: TILE_DIRT },
    ]);
  });

  it('should not prop a spot up when another structure is painted there', () => {
    expect(
      createJoinedPatches(createLevel(STRUCTURE_HEIGHT + 1, 1), [
        { layer: createLayer([TILE_DIRT]), row: 0, column: 0 },
        { layer: createLayer([TILE_BRICK]), row: 1, column: 0 },
      ]),
    ).toEqual([
      { row: STRUCTURE_HEIGHT - 1, column: 0, tile: TILE_DIRT },
      { row: STRUCTURE_HEIGHT, column: 0, tile: TILE_BRICK },
    ]);
  });

  it('should make no marks when there are no layers', () => {
    expect(
      createJoinedPatches(createLevel(STRUCTURE_HEIGHT + 1, 1), []),
    ).toEqual([]);
  });
});
