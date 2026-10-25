import { type Layers, TILE_AIR, TILE_BRICK, TILE_DIRT } from '@mander/model';
import { STRUCTURE_START } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { patchSketchCell } from './patch-sketch-cell';

const createSketch = (): Layers => ({
  tiles: [
    [STRUCTURE_START, TILE_AIR],
    [TILE_DIRT, TILE_DIRT],
  ],
  backTiles: [
    [TILE_AIR, TILE_AIR],
    [TILE_AIR, TILE_AIR],
  ],
});

describe('patchSketchCell', () => {
  it('should paint the cell of the level when the brush paints in front', () => {
    expect(patchSketchCell(createSketch(), 0, 1, TILE_BRICK, 'front')).toEqual({
      tiles: [
        [STRUCTURE_START, TILE_BRICK],
        [TILE_DIRT, TILE_DIRT],
      ],
      backTiles: createSketch().backTiles,
    });
  });

  it('should paint the cell behind the level when the brush paints behind', () => {
    expect(patchSketchCell(createSketch(), 1, 0, TILE_BRICK, 'back')).toEqual({
      tiles: createSketch().tiles,
      backTiles: [
        [TILE_AIR, TILE_AIR],
        [TILE_BRICK, TILE_AIR],
      ],
    });
  });

  it('should move the marker when the cell is painted with a marker the level already holds', () => {
    expect(
      patchSketchCell(createSketch(), 0, 1, STRUCTURE_START, 'front').tiles,
    ).toEqual([
      [TILE_AIR, STRUCTURE_START],
      [TILE_DIRT, TILE_DIRT],
    ]);
  });

  it('should pass the untouched layer on as it was when it paints the other one', () => {
    const sketch = createSketch();

    expect(patchSketchCell(sketch, 0, 1, TILE_BRICK, 'front').backTiles).toBe(
      sketch.backTiles,
    );
  });

  it('should not change the old sketch when it paints a cell', () => {
    const sketch = createSketch();

    patchSketchCell(sketch, 0, 1, TILE_BRICK, 'front');

    expect(sketch).toEqual(createSketch());
  });
});
