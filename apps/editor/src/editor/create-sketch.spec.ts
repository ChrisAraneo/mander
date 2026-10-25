import { describe, expect, it } from 'vitest';

import { createEmptyGrid } from './create-empty-grid';
import { createGrid } from './create-grid';
import { createSketch } from './create-sketch';

describe('createSketch', () => {
  it('should start the level from the pool grid and leave the back layer empty when it is given a pool', () => {
    expect(createSketch('vertical')).toEqual({
      tiles: createGrid('vertical'),
      backTiles: createEmptyGrid('vertical'),
    });
  });

  it('should make a normal sketch when no pool is given', () => {
    expect(createSketch()).toEqual(createSketch('normal'));
  });
});
