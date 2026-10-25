import { describe, expect, it } from 'vitest';

import { cloneSketch } from './clone-sketch';

describe('cloneSketch', () => {
  it('should copy both layers row by row when it is given a sketch', () => {
    const sketch = { tiles: [[1, 2]], backTiles: [[3, 4]] };

    const copy = cloneSketch(sketch);

    expect(copy).toEqual(sketch);
    expect(copy.tiles[0]).not.toBe(sketch.tiles[0]);
    expect(copy.backTiles[0]).not.toBe(sketch.backTiles[0]);
  });

  it('should give empty layers when the sketch is empty', () => {
    expect(cloneSketch({ tiles: [], backTiles: [] })).toEqual({
      tiles: [],
      backTiles: [],
    });
  });
});
