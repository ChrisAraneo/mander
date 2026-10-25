import { describe, expect, it } from 'vitest';

import { getSketchGrid } from './get-sketch-grid';

const SKETCH = { tiles: [[1]], backTiles: [[2]] };

describe('getSketchGrid', () => {
  it('should give the back layer when the brush paints behind the level', () => {
    expect(getSketchGrid(SKETCH, 'back')).toBe(SKETCH.backTiles);
  });

  it('should give the level itself when the brush paints in front', () => {
    expect(getSketchGrid(SKETCH, 'front')).toBe(SKETCH.tiles);
  });
});
