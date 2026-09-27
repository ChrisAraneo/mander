import { TILE_DIRT, TILE_KEY, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { KEY_HEIGHT } from '../../../consts';
import { createKeyPatches } from './create-key-patches';

const LEVEL: Tile[][] = [[TILE_DIRT]];

describe('createKeyPatches', () => {
  it('should mark the row above the candidate with a key tile when there is a candidate', () => {
    expect(
      createKeyPatches({
        tiles: LEVEL,
        candidate: { row: 5, column: 2 },
      }).patches,
    ).toEqual([{ row: 4, column: 2, tile: TILE_KEY }]);
  });

  it('should make as many marks as the key height when there is a candidate', () => {
    expect(
      createKeyPatches({
        tiles: LEVEL,
        candidate: { row: 5, column: 2 },
      }).patches,
    ).toHaveLength(KEY_HEIGHT);
  });

  it('should make no marks when there is no candidate', () => {
    expect(
      createKeyPatches({ tiles: LEVEL, candidate: undefined }).patches,
    ).toEqual([]);
  });

  it('should keep the grid the same when it makes the marks', () => {
    expect(createKeyPatches({ tiles: LEVEL, candidate: undefined }).tiles).toBe(
      LEVEL,
    );
  });
});
