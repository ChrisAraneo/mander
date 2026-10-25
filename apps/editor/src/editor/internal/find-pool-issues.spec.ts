import { findVerticalIssues } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { createSketch } from '../create-sketch';
import { findPoolIssues } from './find-pool-issues';

describe('findPoolIssues', () => {
  it('should give the vertical checks when the pool is the vertical one', () => {
    const sketch = createSketch('vertical');

    expect(findPoolIssues(sketch, 'vertical')).toEqual(
      findVerticalIssues(sketch.tiles),
    );
  });

  it('should find nothing when the pool is a horizontal one', () => {
    expect(findPoolIssues(createSketch('normal'), 'normal')).toEqual([]);
    expect(findPoolIssues(createSketch('hard'), 'hard')).toEqual([]);
  });

  it('should find nothing when the sketch is empty and the pool is a horizontal one', () => {
    expect(findPoolIssues({ tiles: [], backTiles: [] }, 'normal')).toEqual([]);
  });
});
