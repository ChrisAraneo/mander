import type { Triangle } from '@mander/utils';
import { forEach, map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_SIZE } from '../tile/consts';
import { computeSpikeTriangles } from './compute-spike-triangles';
import { PRONG_HEIGHT, PRONG_PITCH, PRONG_WIDTH, SPIKE_PRONGS } from './spike';

const TILE_X = 4;
const TILE_Y = 3;
const PIXEL_X = TILE_X * TILE_SIZE;
const PIXEL_Y = TILE_Y * TILE_SIZE;

const left = (triangle: Triangle): number => triangle[0].x;
const right = (triangle: Triangle): number => triangle[2].x;
const apex = (triangle: Triangle): number => triangle[1].y;
const base = (triangle: Triangle): number => triangle[0].y;

describe('computeSpikeTriangles', () => {
  it('should carve a full set of prongs when the tooth belongs to a strip', () => {
    expect(
      computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'FLOOR', 'STRIP'),
    ).toHaveLength(SPIKE_PRONGS);
  });

  it('should carve a single prong when the tooth stands on its own', () => {
    expect(
      computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'FLOOR', 'SINGLE'),
    ).toHaveLength(1);
  });

  it('should stand the prongs on the bottom edge of their tile when the tooth is a floor one', () => {
    forEach(
      computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'FLOOR', 'STRIP'),
      (prong) => {
        expect(prong[0].y).toBe((TILE_Y + 1) * TILE_SIZE);
        expect(prong[2].y).toBe((TILE_Y + 1) * TILE_SIZE);
      },
    );
  });

  it('should point the prongs up a prong height clear of the ground when the tooth is a floor one', () => {
    forEach(
      computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'FLOOR', 'STRIP'),
      (prong) => {
        expect(apex(prong)).toBeCloseTo(
          (TILE_Y + 1) * TILE_SIZE - PRONG_HEIGHT,
          10,
        );
        expect(apex(prong)).toBeLessThan(base(prong));
      },
    );
  });

  it('should hang the prongs from the top edge of their tile when the tooth is a ceiling one', () => {
    forEach(
      computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'CEILING', 'STRIP'),
      (prong) => {
        expect(prong[0].y).toBe(TILE_Y * TILE_SIZE);
        expect(prong[2].y).toBe(TILE_Y * TILE_SIZE);
      },
    );
  });

  it('should point the prongs down a prong height clear of the roof when the tooth is a ceiling one', () => {
    forEach(
      computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'CEILING', 'STRIP'),
      (prong) => {
        expect(apex(prong)).toBeCloseTo(TILE_Y * TILE_SIZE + PRONG_HEIGHT, 10);
        expect(apex(prong)).toBeGreaterThan(base(prong));
      },
    );
  });

  it('should give every prong the same width when it carves a strip', () => {
    forEach(computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'FLOOR', 'STRIP'), (prong) =>
      expect(right(prong) - left(prong)).toBeCloseTo(PRONG_WIDTH, 10),
    );
  });

  it('should set every apex halfway between the feet when it carves a strip', () => {
    forEach(computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'FLOOR', 'STRIP'), (prong) =>
      expect(prong[1].x).toBeCloseTo((left(prong) + right(prong)) / 2, 10),
    );
  });

  it('should space the prongs a pitch apart when it carves a strip', () => {
    const prongs = computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'FLOOR', 'STRIP');

    forEach(times(SPIKE_PRONGS - 1), (index) =>
      expect(left(prongs[index + 1]) - left(prongs[index])).toBeCloseTo(
        PRONG_PITCH,
        10,
      ),
    );
  });

  it('should centre the prongs within their tile when it carves a strip', () => {
    const prongs = computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'FLOOR', 'STRIP');

    expect((left(prongs[0]) + right(prongs[SPIKE_PRONGS - 1])) / 2).toBeCloseTo(
      TILE_X * TILE_SIZE + TILE_SIZE / 2,
      10,
    );
  });

  it('should centre the prong within its tile when it carves a lone tooth', () => {
    const [prong] = computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'FLOOR', 'SINGLE');

    expect((left(prong) + right(prong)) / 2).toBeCloseTo(
      TILE_X * TILE_SIZE + TILE_SIZE / 2,
      10,
    );
  });

  it('should keep every prong inside its own tile when it carves a strip', () => {
    forEach(
      computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'FLOOR', 'STRIP'),
      (prong) => {
        expect(left(prong)).toBeGreaterThanOrEqual(TILE_X * TILE_SIZE);
        expect(right(prong)).toBeLessThanOrEqual((TILE_X + 1) * TILE_SIZE);
      },
    );
  });

  it('should line the prongs up with the floor ones when the same tile is carved as ceiling', () => {
    const floor = computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'FLOOR', 'STRIP');
    const ceiling = computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'CEILING', 'STRIP');

    expect(map(ceiling, left)).toEqual(map(floor, left));
  });

  it('should shift the whole set by a tile when the tooth steps across or down', () => {
    const origin = computeSpikeTriangles(0, 0, 'FLOOR', 'STRIP');
    const moved = computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'FLOOR', 'STRIP');

    forEach(moved, (prong, index) =>
      forEach(prong, (point, corner) => {
        expect(point.x).toBeCloseTo(
          origin[index][corner].x + TILE_X * TILE_SIZE,
          10,
        );
        expect(point.y).toBeCloseTo(
          origin[index][corner].y + TILE_Y * TILE_SIZE,
          10,
        );
      }),
    );
  });
});
