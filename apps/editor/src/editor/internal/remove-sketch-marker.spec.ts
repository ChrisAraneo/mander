import { type Layers, TILE_AIR, TILE_DIRT } from '@mander/model';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { removeSketchMarker } from './remove-sketch-marker';

const createSketch = (): Layers => ({
  tiles: [[STRUCTURE_START, TILE_DIRT, STRUCTURE_END]],
  backTiles: [[TILE_DIRT]],
});

describe('removeSketchMarker', () => {
  it('should turn the old marker into air when the value is that marker', () => {
    expect(removeSketchMarker(createSketch(), STRUCTURE_START)).toEqual({
      tiles: [[TILE_AIR, TILE_DIRT, STRUCTURE_END]],
      backTiles: [[TILE_DIRT]],
    });
  });

  it('should give the same sketch back when the value is not a marker', () => {
    const sketch = createSketch();

    expect(removeSketchMarker(sketch, TILE_DIRT)).toBe(sketch);
  });

  it('should pass the back layer on unchanged when it removes a marker', () => {
    const sketch = createSketch();

    expect(removeSketchMarker(sketch, STRUCTURE_END).backTiles).toBe(
      sketch.backTiles,
    );
  });

  it('should not change the old sketch when it removes a marker', () => {
    const sketch = createSketch();

    removeSketchMarker(sketch, STRUCTURE_START);

    expect(sketch).toEqual(createSketch());
  });
});
