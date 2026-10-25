import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_SIZE } from '../tile/consts';
import { computeSpikeTriangles } from './compute-spike-triangles';
import { PRONG_HEIGHT, PRONG_PITCH, PRONG_WIDTH, SPIKE_PRONGS } from './consts';
import type { Triangle } from './types/triangle';

const TILE_X = 4;
const TILE_Y = 3;
const PIXEL_X = TILE_X * TILE_SIZE;
const PIXEL_Y = TILE_Y * TILE_SIZE;

const FLOOR_STRIP = computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'FLOOR', 'STRIP');

const CEILING_STRIP = computeSpikeTriangles(
  PIXEL_X,
  PIXEL_Y,
  'CEILING',
  'STRIP',
);

const getLeftX = (triangle: Triangle): number => triangle[0].x;
const getRightX = (triangle: Triangle): number => triangle[2].x;
const getTipX = (triangle: Triangle): number => triangle[1].x;
const getTipY = (triangle: Triangle): number => triangle[1].y;
const getBaseY = (triangle: Triangle): number => triangle[0].y;
const getEndBaseY = (triangle: Triangle): number => triangle[2].y;

const createEveryProng = (value: unknown): unknown[] =>
  times(SPIKE_PRONGS, () => value);

describe('computeSpikeTriangles', () => {
  it('should return one triangle per prong when the spike is a strip', () => {
    expect(FLOOR_STRIP).toHaveLength(SPIKE_PRONGS);
  });

  it('should return one triangle when the spike is single', () => {
    expect(
      computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'FLOOR', 'SINGLE'),
    ).toHaveLength(1);
  });

  it('should put the bottom corners on the bottom edge of the tile when the spike is on the floor', () => {
    expect(map(FLOOR_STRIP, getBaseY)).toEqual(
      createEveryProng((TILE_Y + 1) * TILE_SIZE),
    );
    expect(map(FLOOR_STRIP, getEndBaseY)).toEqual(
      createEveryProng((TILE_Y + 1) * TILE_SIZE),
    );
  });

  it('should put the tips one prong height above the ground when the spike is on the floor', () => {
    expect(map(FLOOR_STRIP, getTipY)).toEqual(
      createEveryProng(
        expect.closeTo((TILE_Y + 1) * TILE_SIZE - PRONG_HEIGHT, 10),
      ),
    );
  });

  it('should put the bottom corners on the top edge of the tile when the spike is on the ceiling', () => {
    expect(map(CEILING_STRIP, getBaseY)).toEqual(
      createEveryProng(TILE_Y * TILE_SIZE),
    );
    expect(map(CEILING_STRIP, getEndBaseY)).toEqual(
      createEveryProng(TILE_Y * TILE_SIZE),
    );
  });

  it('should put the tips one prong height below the roof when the spike is on the ceiling', () => {
    expect(map(CEILING_STRIP, getTipY)).toEqual(
      createEveryProng(expect.closeTo(TILE_Y * TILE_SIZE + PRONG_HEIGHT, 10)),
    );
  });

  it('should give every triangle the prong width when the spike is a strip', () => {
    expect(
      map(FLOOR_STRIP, (prong) => getRightX(prong) - getLeftX(prong)),
    ).toEqual(createEveryProng(expect.closeTo(PRONG_WIDTH, 10)));
  });

  it('should put every tip halfway between the bottom corners when the spike is a strip', () => {
    expect(map(FLOOR_STRIP, getTipX)).toEqual(
      map(FLOOR_STRIP, (prong) =>
        expect.closeTo((getLeftX(prong) + getRightX(prong)) / 2, 10),
      ),
    );
  });

  it('should space the triangles one prong pitch apart when the spike is a strip', () => {
    expect(
      times(
        SPIKE_PRONGS - 1,
        (index) =>
          getLeftX(FLOOR_STRIP[index + 1]) - getLeftX(FLOOR_STRIP[index]),
      ),
    ).toEqual(times(SPIKE_PRONGS - 1, () => expect.closeTo(PRONG_PITCH, 10)));
  });

  it('should centre the triangles in the tile when the spike is a strip', () => {
    expect(
      (getLeftX(FLOOR_STRIP[0]) + getRightX(FLOOR_STRIP[SPIKE_PRONGS - 1])) / 2,
    ).toBeCloseTo(TILE_X * TILE_SIZE + TILE_SIZE / 2, 10);
  });

  it('should centre the triangle in the tile when the spike is single', () => {
    const [prong] = computeSpikeTriangles(PIXEL_X, PIXEL_Y, 'FLOOR', 'SINGLE');

    expect((getLeftX(prong) + getRightX(prong)) / 2).toBeCloseTo(
      TILE_X * TILE_SIZE + TILE_SIZE / 2,
      10,
    );
  });

  it('should keep every triangle inside the tile when the spike is a strip', () => {
    expect(
      map(
        FLOOR_STRIP,
        (prong) =>
          getLeftX(prong) >= TILE_X * TILE_SIZE &&
          getRightX(prong) <= (TILE_X + 1) * TILE_SIZE,
      ),
    ).toEqual(createEveryProng(true));
  });

  it('should line up with the floor triangles when the same tile is on the ceiling', () => {
    expect(map(CEILING_STRIP, getLeftX)).toEqual(map(FLOOR_STRIP, getLeftX));
  });

  it('should move every corner by one tile per tile when the spike moves across and down', () => {
    expect(FLOOR_STRIP).toEqual(
      map(computeSpikeTriangles(0, 0, 'FLOOR', 'STRIP'), (prong) =>
        map(prong, (point) => ({
          x: expect.closeTo(point.x + TILE_X * TILE_SIZE, 10),
          y: expect.closeTo(point.y + TILE_Y * TILE_SIZE, 10),
        })),
      ),
    );
  });
});
