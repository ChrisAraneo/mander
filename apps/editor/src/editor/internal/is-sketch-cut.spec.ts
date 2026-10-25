import { describe, expect, it } from 'vitest';

import { createSketch } from '../create-sketch';
import { isSketchCut } from './is-sketch-cut';

describe('isSketchCut', () => {
  it('should accept the sketch when both layers have the size of the pool', () => {
    expect(isSketchCut(createSketch('vertical'), 'vertical')).toBe(true);
  });

  it('should turn the sketch away when it has the size of another pool', () => {
    expect(isSketchCut(createSketch('normal'), 'vertical')).toBe(false);
  });

  it('should turn the sketch away when it is empty', () => {
    expect(isSketchCut({ tiles: [], backTiles: [] }, 'normal')).toBe(false);
  });
});
