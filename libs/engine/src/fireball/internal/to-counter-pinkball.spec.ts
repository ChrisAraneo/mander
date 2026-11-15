import type { Fireball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { PINKBALL_CYCLE_ANGLE, PINKBALL_HALF_CYCLE_ANGLE } from '../consts';
import { computePinkballOrbit } from './compute-pinkball-orbit';
import { toCounterPinkball } from './to-counter-pinkball';

const PRECISION = 6;

const CLOSE_PRECISION = 10;

const PART_WAY_ANGLE = 1;

const OPPOSITE_COSINE = -1;

const BLOCK_LEFT = 48;

const BLOCK_TOP = 16;

const PINKBALL: Fireball = {
  kind: 'PINK',
  spin: 'CLOCKWISE',
  origin: { x: BLOCK_LEFT, y: BLOCK_TOP },
  angle: PART_WAY_ANGLE,
};

describe('toCounterPinkball', () => {
  it('should send the counter round the other way when it pairs it up', () => {
    expect(toCounterPinkball(PINKBALL).spin).toBe('ANTICLOCKWISE');
  });

  it('should send the counter of an anticlockwise pinkball round clockwise when it pairs it up', () => {
    expect(toCounterPinkball({ ...PINKBALL, spin: 'ANTICLOCKWISE' }).spin).toBe(
      'CLOCKWISE',
    );
  });

  it('should hang the counter on the same block when it pairs it up', () => {
    expect(toCounterPinkball(PINKBALL).origin).toEqual(PINKBALL.origin);
  });

  it('should keep the counter a pink ball when it pairs it up', () => {
    expect(toCounterPinkball(PINKBALL).kind).toBe('PINK');
  });

  it('should set the counter off half a cycle on when it pairs it up', () => {
    expect(toCounterPinkball(PINKBALL).angle).toBeCloseTo(
      PART_WAY_ANGLE + PINKBALL_HALF_CYCLE_ANGLE,
      PRECISION,
    );
  });

  it('should keep the counter within one pinkball cycle when the pinkball is past halfway', () => {
    expect(
      toCounterPinkball({
        ...PINKBALL,
        angle: PINKBALL_CYCLE_ANGLE - PART_WAY_ANGLE,
      }).angle,
    ).toBeCloseTo(PINKBALL_HALF_CYCLE_ANGLE - PART_WAY_ANGLE, PRECISION);
  });

  it('should hold the counter as far out as the pinkball when it pairs it up', () => {
    expect(
      computePinkballOrbit(toCounterPinkball(PINKBALL).angle).radius,
    ).toBeCloseTo(computePinkballOrbit(PINKBALL.angle).radius, CLOSE_PRECISION);
  });

  it('should stand the counter on the far side of the block when it pairs it up', () => {
    expect(
      Math.cos(
        computePinkballOrbit(toCounterPinkball(PINKBALL).angle).angle -
          computePinkballOrbit(PINKBALL.angle).angle,
      ),
    ).toBeCloseTo(OPPOSITE_COSINE, CLOSE_PRECISION);
  });

  it('should bring the pinkball back when the counter is paired up again', () => {
    expect(toCounterPinkball(toCounterPinkball(PINKBALL))).toEqual({
      ...PINKBALL,
      angle: expect.closeTo(PINKBALL.angle, PRECISION),
    });
  });
});
