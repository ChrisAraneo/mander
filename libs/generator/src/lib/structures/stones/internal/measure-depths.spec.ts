import { TILE_AIR, TILE_BRICK, TILE_DIRT, TILE_SPIKE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { measureDepths } from './measure-depths';

describe('measureDepths', () => {
  it('should count how deep each solid tile is under the surface', () => {
    expect(
      measureDepths([[TILE_AIR], [TILE_DIRT], [TILE_DIRT], [TILE_DIRT]]),
    ).toEqual([[-1], [0], [1], [2]]);
  });

  it('should count each column on its own', () => {
    expect(
      measureDepths([
        [TILE_DIRT, TILE_AIR],
        [TILE_DIRT, TILE_DIRT],
      ]),
    ).toEqual([
      [0, -1],
      [1, 0],
    ]);
  });

  it('should count any solid tile and not only dirt', () => {
    expect(measureDepths([[TILE_BRICK], [TILE_DIRT]])).toEqual([[0], [1]]);
  });

  it('should start counting again under a tile that is not solid', () => {
    expect(
      measureDepths([[TILE_DIRT], [TILE_DIRT], [TILE_SPIKE], [TILE_DIRT]]),
    ).toEqual([[0], [1], [-1], [0]]);
  });

  it('should give nothing when it gets an empty grid', () => {
    expect(measureDepths([])).toEqual([]);
  });
});
