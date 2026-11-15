import type { Triangle } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isOverlappingTriangle } from './is-overlapping-triangle';

const TILE_EDGE = 32;
const BOX_SIZE = 8;
const CORNER_BOX_SIZE = 6;
const BEYOND_EDGE = 24;
const FAR_AWAY = 200;

const createTriangle = (): Triangle => [
  { x: 0, y: 0 },
  { x: TILE_EDGE, y: 0 },
  { x: 0, y: TILE_EDGE },
];

const TRIANGLE = createTriangle();

describe('isOverlappingTriangle', () => {
  it('should say yes when the box lies over the triangle', () => {
    const isOverlapping = isOverlappingTriangle(
      TRIANGLE,
      0,
      0,
      BOX_SIZE,
      BOX_SIZE,
    );

    expect(isOverlapping).toBe(true);
  });

  it('should say no when the box sits inside the corner of the triangle but beyond its slanted edge', () => {
    const isOverlapping = isOverlappingTriangle(
      TRIANGLE,
      BEYOND_EDGE,
      BEYOND_EDGE,
      CORNER_BOX_SIZE,
      CORNER_BOX_SIZE,
    );

    expect(isOverlapping).toBe(false);
  });

  it('should say no when the box is far away from the triangle', () => {
    const isOverlapping = isOverlappingTriangle(
      TRIANGLE,
      FAR_AWAY,
      FAR_AWAY,
      BOX_SIZE,
      BOX_SIZE,
    );

    expect(isOverlapping).toBe(false);
  });

  it('should say no when the box only touches a corner of the triangle', () => {
    const isOverlapping = isOverlappingTriangle(
      TRIANGLE,
      TILE_EDGE,
      0,
      BOX_SIZE,
      BOX_SIZE,
    );

    expect(isOverlapping).toBe(false);
  });

  it('should not change the triangle it was given when it checks the box', () => {
    const triangle = createTriangle();

    isOverlappingTriangle(triangle, 0, 0, BOX_SIZE, BOX_SIZE);

    expect(triangle).toEqual(createTriangle());
  });
});
