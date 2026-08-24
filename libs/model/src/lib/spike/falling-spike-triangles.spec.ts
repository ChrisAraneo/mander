import type { Triangle } from '@mander/utils';
import { forEach } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_SIZE } from '../tile/consts';
import { TERMINAL_VELOCITY } from '../world/consts';
import type { FallingSpike } from './falling-spike';
import { fallingSpikeTriangles } from './falling-spike-triangles';
import { PRONG_HEIGHT, PRONG_WIDTH } from './spike';

const PIXEL_X = 4 * TILE_SIZE;
const PIXEL_Y = 3 * TILE_SIZE;

const left = (triangle: Triangle): number => triangle[0].x;
const right = (triangle: Triangle): number => triangle[2].x;
const apex = (triangle: Triangle): number => triangle[1].y;
const base = (triangle: Triangle): number => triangle[0].y;

const spike = (
  x: number,
  y: number,
  isFalling = false,
  current = 0,
): FallingSpike => ({
  position: { x, y },
  velocity: { y: { current, max: TERMINAL_VELOCITY } },
  statuses: { isFalling },
});

describe('fallingSpikeTriangles', () => {
  it('should return one triangle when the spike is falling', () => {
    expect(fallingSpikeTriangles(spike(PIXEL_X, PIXEL_Y))).toHaveLength(1);
  });

  it('should put the bottom corners on the top edge of the spike when it makes the triangle', () => {
    const [prong] = fallingSpikeTriangles(spike(PIXEL_X, PIXEL_Y));

    expect(prong[0].y).toBe(PIXEL_Y);
    expect(prong[2].y).toBe(PIXEL_Y);
  });

  it('should point the tip down by one prong height when it makes the triangle', () => {
    const [prong] = fallingSpikeTriangles(spike(PIXEL_X, PIXEL_Y));

    expect(apex(prong)).toBeCloseTo(PIXEL_Y + PRONG_HEIGHT, 10);
    expect(apex(prong)).toBeGreaterThan(base(prong));
  });

  it('should give the triangle the full prong width when it makes the triangle', () => {
    const [prong] = fallingSpikeTriangles(spike(PIXEL_X, PIXEL_Y));

    expect(right(prong) - left(prong)).toBeCloseTo(PRONG_WIDTH, 10);
  });

  it('should put the tip halfway between the bottom corners when it makes the triangle', () => {
    const [prong] = fallingSpikeTriangles(spike(PIXEL_X, PIXEL_Y));

    expect(prong[1].x).toBeCloseTo((left(prong) + right(prong)) / 2, 10);
  });

  it('should centre the triangle in the tile when the spike sits on the grid', () => {
    const [prong] = fallingSpikeTriangles(spike(PIXEL_X, PIXEL_Y));

    expect((left(prong) + right(prong)) / 2).toBeCloseTo(
      PIXEL_X + TILE_SIZE / 2,
      10,
    );
  });

  it('should keep the triangle inside one tile width when it makes the triangle', () => {
    const [prong] = fallingSpikeTriangles(spike(PIXEL_X, PIXEL_Y));

    expect(left(prong)).toBeGreaterThanOrEqual(PIXEL_X);
    expect(right(prong)).toBeLessThanOrEqual(PIXEL_X + TILE_SIZE);
  });

  it('should use the exact pixel position when the spike sits between tiles', () => {
    const [prong] = fallingSpikeTriangles(
      spike(PIXEL_X + 3.25, PIXEL_Y + 7.5, true),
    );

    expect(base(prong)).toBeCloseTo(PIXEL_Y + 7.5, 10);
    expect((left(prong) + right(prong)) / 2).toBeCloseTo(
      PIXEL_X + 3.25 + TILE_SIZE / 2,
      10,
    );
  });

  it('should move the triangle down with the spike when it drops', () => {
    const [resting] = fallingSpikeTriangles(spike(PIXEL_X, PIXEL_Y));
    const [dropped] = fallingSpikeTriangles(
      spike(PIXEL_X, PIXEL_Y + 40.5, true, 120),
    );

    forEach(dropped, (point, corner) => {
      expect(point.x).toBeCloseTo(resting[corner].x, 10);
      expect(point.y).toBeCloseTo(resting[corner].y + 40.5, 10);
    });
  });

  it('should ignore the speed and the falling flag when the spike falls at full speed', () => {
    expect(
      fallingSpikeTriangles(spike(PIXEL_X, PIXEL_Y, true, TERMINAL_VELOCITY)),
    ).toEqual(fallingSpikeTriangles(spike(PIXEL_X, PIXEL_Y)));
  });
});
