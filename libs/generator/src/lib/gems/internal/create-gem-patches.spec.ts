import { TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { GEM_REST_HEIGHT } from '../../consts';
import { createGemPatches } from './create-gem-patches';

const LEVEL: Tile[][] = [[TILE_DIRT]];

describe('createGemPatches', () => {
  it('should mark the spot two rows above the candidate with a gem tile when there is a candidate', () => {
    expect(
      createGemPatches({
        tiles: LEVEL,
        candidates: [{ row: 5, column: 2 }],
      }).patches,
    ).toEqual([{ row: 3, column: 2, tile: TILE_GEM }]);
  });

  it('should make one mark as high as the rest height over each candidate when there are several', () => {
    expect(
      createGemPatches({
        tiles: LEVEL,
        candidates: [
          { row: 5, column: 2 },
          { row: 9, column: 7 },
        ],
      }).patches,
    ).toEqual([
      { row: 5 - GEM_REST_HEIGHT, column: 2, tile: TILE_GEM },
      { row: 9 - GEM_REST_HEIGHT, column: 7, tile: TILE_GEM },
    ]);
  });

  it('should make no marks when there are no candidates', () => {
    expect(createGemPatches({ tiles: LEVEL, candidates: [] }).patches).toEqual(
      [],
    );
  });

  it('should keep the grid the same when it makes the marks', () => {
    expect(createGemPatches({ tiles: LEVEL, candidates: [] }).tiles).toBe(
      LEVEL,
    );
  });
});
