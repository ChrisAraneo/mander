import { TILE_CHEST, TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { CHEST_HEIGHT } from '../../../consts';
import { createChestPatches } from './create-chest-patches';

const LEVEL: Tile[][] = [[TILE_DIRT]];

describe('createChestPatches', () => {
  it('should mark the row above the candidate with a chest tile when there is a candidate', () => {
    expect(
      createChestPatches({
        tiles: LEVEL,
        candidate: { row: 5, column: 2 },
      }).patches,
    ).toEqual([{ row: 4, column: 2, tile: TILE_CHEST }]);
  });

  it('should make as many marks as the chest height when there is a candidate', () => {
    expect(
      createChestPatches({
        tiles: LEVEL,
        candidate: { row: 5, column: 2 },
      }).patches,
    ).toHaveLength(CHEST_HEIGHT);
  });

  it('should make no marks when there is no candidate', () => {
    expect(
      createChestPatches({ tiles: LEVEL, candidate: undefined }).patches,
    ).toEqual([]);
  });

  it('should keep the grid the same when it makes the marks', () => {
    expect(
      createChestPatches({ tiles: LEVEL, candidate: undefined }).tiles,
    ).toBe(LEVEL);
  });
});
