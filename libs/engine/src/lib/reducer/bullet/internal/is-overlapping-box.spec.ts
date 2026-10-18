import type { Rectangle } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isOverlappingBox } from './is-overlapping-box';

const BOX: Rectangle = { x: 0, y: 0, width: 10, height: 10 };

const OVERLAPPING_BOX: Rectangle = { x: 5, y: 5, width: 10, height: 10 };

const RIGHT_TOUCHING_BOX: Rectangle = { x: 10, y: 0, width: 10, height: 10 };

const BELOW_TOUCHING_BOX: Rectangle = { x: 0, y: 10, width: 10, height: 10 };

const FAR_BOX: Rectangle = { x: 100, y: 100, width: 10, height: 10 };

describe('isOverlappingBox', () => {
  it('should say yes when the two boxes overlap', () => {
    const isOverlapping = isOverlappingBox(BOX, OVERLAPPING_BOX);

    expect(isOverlapping).toBe(true);
  });

  it('should say yes when the two overlapping boxes are given the other way round', () => {
    const isOverlapping = isOverlappingBox(OVERLAPPING_BOX, BOX);

    expect(isOverlapping).toBe(true);
  });

  it('should say no when the boxes only touch along a side edge', () => {
    const isOverlapping = isOverlappingBox(BOX, RIGHT_TOUCHING_BOX);

    expect(isOverlapping).toBe(false);
  });

  it('should say no when the boxes only touch along a bottom edge', () => {
    const isOverlapping = isOverlappingBox(BOX, BELOW_TOUCHING_BOX);

    expect(isOverlapping).toBe(false);
  });

  it('should say no when the boxes are far apart', () => {
    const isOverlapping = isOverlappingBox(BOX, FAR_BOX);

    expect(isOverlapping).toBe(false);
  });
});
