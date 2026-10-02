import { TILE_AIR, TILE_BRICK, TILE_DIRT, TILE_SPIKE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computeDepths } from './compute-depths';

describe('computeDepths', () => {
  it('should count how deep each solid tile lies when the column is filled below the surface', () => {
    expect(
      computeDepths([[TILE_AIR], [TILE_DIRT], [TILE_DIRT], [TILE_DIRT]]),
    ).toEqual([[-1], [0], [1], [2]]);
  });

  it('should count each column on its own when the columns differ', () => {
    expect(
      computeDepths([
        [TILE_DIRT, TILE_AIR],
        [TILE_DIRT, TILE_DIRT],
      ]),
    ).toEqual([
      [0, -1],
      [1, 0],
    ]);
  });

  it('should count a solid tile when it is not dirt', () => {
    expect(computeDepths([[TILE_BRICK], [TILE_DIRT]])).toEqual([[0], [1]]);
  });

  it('should start counting again when a tile above is not solid', () => {
    expect(
      computeDepths([[TILE_DIRT], [TILE_DIRT], [TILE_SPIKE], [TILE_DIRT]]),
    ).toEqual([[0], [1], [-1], [0]]);
  });

  it('should give nothing when it gets an empty grid', () => {
    expect(computeDepths([])).toEqual([]);
  });
});
