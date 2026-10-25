import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { addMissingSketchTiles } from './add-missing-sketch-tiles';

describe('addMissingSketchTiles', () => {
  it('should fill the back layer with air up to the size of the level when it is shorter', () => {
    expect(
      addMissingSketchTiles({
        tiles: [
          [TILE_DIRT, TILE_DIRT],
          [TILE_DIRT, TILE_DIRT],
        ],
        backTiles: [],
      }),
    ).toEqual({
      tiles: [
        [TILE_DIRT, TILE_DIRT],
        [TILE_DIRT, TILE_DIRT],
      ],
      backTiles: [
        [TILE_AIR, TILE_AIR],
        [TILE_AIR, TILE_AIR],
      ],
    });
  });

  it('should cut the back layer to the size of the level when it is larger', () => {
    expect(
      addMissingSketchTiles({
        tiles: [[TILE_DIRT]],
        backTiles: [
          [TILE_DIRT, TILE_DIRT],
          [TILE_DIRT, TILE_DIRT],
        ],
      }),
    ).toEqual({ tiles: [[TILE_DIRT]], backTiles: [[TILE_DIRT]] });
  });

  it('should give empty layers when the level is empty', () => {
    expect(
      addMissingSketchTiles({ tiles: [], backTiles: [[TILE_DIRT]] }),
    ).toEqual({ tiles: [], backTiles: [] });
  });
});
