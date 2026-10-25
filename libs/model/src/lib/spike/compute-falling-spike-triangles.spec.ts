import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_SIZE } from '../tile/consts';
import { TERMINAL_VELOCITY } from '../world/consts';
import { computeFallingSpikeTriangles } from './compute-falling-spike-triangles';
import { PRONG_HEIGHT, PRONG_WIDTH } from './consts';
import type { FallingSpike } from './types/falling-spike';
import type { Triangle } from './types/triangle';

const PIXEL_X = 4 * TILE_SIZE;
const PIXEL_Y = 3 * TILE_SIZE;

const getLeftX = (triangle: Triangle): number => triangle[0].x;
const getRightX = (triangle: Triangle): number => triangle[2].x;
const getTipY = (triangle: Triangle): number => triangle[1].y;
const getBaseY = (triangle: Triangle): number => triangle[0].y;

const createFallingSpike = (
  positionX: number,
  positionY: number,
  isFalling = false,
  current = 0,
): FallingSpike => ({
  position: { x: positionX, y: positionY },
  velocity: { y: { current, max: TERMINAL_VELOCITY } },
  statuses: { isFalling },
});

describe('computeFallingSpikeTriangles', () => {
  it('should return one triangle when the spike is falling', () => {
    expect(
      computeFallingSpikeTriangles(createFallingSpike(PIXEL_X, PIXEL_Y)),
    ).toHaveLength(1);
  });

  it('should put the bottom corners on the top edge of the spike when it makes the triangle', () => {
    const [prong] = computeFallingSpikeTriangles(
      createFallingSpike(PIXEL_X, PIXEL_Y),
    );

    expect(prong[0].y).toBe(PIXEL_Y);
    expect(prong[2].y).toBe(PIXEL_Y);
  });

  it('should point the tip down by one prong height when it makes the triangle', () => {
    const [prong] = computeFallingSpikeTriangles(
      createFallingSpike(PIXEL_X, PIXEL_Y),
    );

    expect(getTipY(prong)).toBeCloseTo(PIXEL_Y + PRONG_HEIGHT, 10);
    expect(getTipY(prong)).toBeGreaterThan(getBaseY(prong));
  });

  it('should give the triangle the full prong width when it makes the triangle', () => {
    const [prong] = computeFallingSpikeTriangles(
      createFallingSpike(PIXEL_X, PIXEL_Y),
    );

    expect(getRightX(prong) - getLeftX(prong)).toBeCloseTo(PRONG_WIDTH, 10);
  });

  it('should put the tip halfway between the bottom corners when it makes the triangle', () => {
    const [prong] = computeFallingSpikeTriangles(
      createFallingSpike(PIXEL_X, PIXEL_Y),
    );

    expect(prong[1].x).toBeCloseTo(
      (getLeftX(prong) + getRightX(prong)) / 2,
      10,
    );
  });

  it('should centre the triangle in the tile when the spike sits on the grid', () => {
    const [prong] = computeFallingSpikeTriangles(
      createFallingSpike(PIXEL_X, PIXEL_Y),
    );

    expect((getLeftX(prong) + getRightX(prong)) / 2).toBeCloseTo(
      PIXEL_X + TILE_SIZE / 2,
      10,
    );
  });

  it('should keep the triangle inside one tile width when it makes the triangle', () => {
    const [prong] = computeFallingSpikeTriangles(
      createFallingSpike(PIXEL_X, PIXEL_Y),
    );

    expect(getLeftX(prong)).toBeGreaterThanOrEqual(PIXEL_X);
    expect(getRightX(prong)).toBeLessThanOrEqual(PIXEL_X + TILE_SIZE);
  });

  it('should use the exact pixel position when the spike sits between tiles', () => {
    const [prong] = computeFallingSpikeTriangles(
      createFallingSpike(PIXEL_X + 3.25, PIXEL_Y + 7.5, true),
    );

    expect(getBaseY(prong)).toBeCloseTo(PIXEL_Y + 7.5, 10);
    expect((getLeftX(prong) + getRightX(prong)) / 2).toBeCloseTo(
      PIXEL_X + 3.25 + TILE_SIZE / 2,
      10,
    );
  });

  it('should move the triangle down with the spike when it drops', () => {
    const [resting] = computeFallingSpikeTriangles(
      createFallingSpike(PIXEL_X, PIXEL_Y),
    );

    const [dropped] = computeFallingSpikeTriangles(
      createFallingSpike(PIXEL_X, PIXEL_Y + 40.5, true, 120),
    );

    expect(dropped).toEqual(
      map(resting, (point) => ({
        x: expect.closeTo(point.x, 10),
        y: expect.closeTo(point.y + 40.5, 10),
      })),
    );
  });

  it('should ignore the speed and the falling flag when the spike falls at full speed', () => {
    expect(
      computeFallingSpikeTriangles(
        createFallingSpike(PIXEL_X, PIXEL_Y, true, TERMINAL_VELOCITY),
      ),
    ).toEqual(
      computeFallingSpikeTriangles(createFallingSpike(PIXEL_X, PIXEL_Y)),
    );
  });
});
