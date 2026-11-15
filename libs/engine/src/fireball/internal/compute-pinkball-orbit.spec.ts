import type { Point } from '@mander/model';
import { every, map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  FIREBALL_ORBIT_RADIUS,
  FULL_TURN,
  PINKBALL_CYCLE_ANGLE,
  PINKBALL_LOOPS,
  PINKBALL_LOOP_ANGLE,
  PINKBALL_LOOP_RADIUS,
} from '../consts';
import { computePinkballOrbit } from './compute-pinkball-orbit';
import type { FireballOrbit } from './types/fireball-orbit';

const PRECISION = 10;

const LOOP_SAMPLES = 24;

const CYCLE_SAMPLES = 720;

const ON_BLOCK_RADIUS = 0;

const HALF_LOOP_ANGLE = Math.PI;

const PAST_CYCLE_ANGLE = 1;

const toPoint = ({ radius, angle }: FireballOrbit): Point => ({
  x: Math.cos(angle) * radius,
  y: Math.sin(angle) * radius,
});

const computeDistanceFromLoopCentre = (at: Point): number =>
  Math.hypot(at.x - PINKBALL_LOOP_RADIUS, at.y);

describe('computePinkballOrbit', () => {
  it('should sit the ball on its block when a loop begins', () => {
    expect(computePinkballOrbit(0).radius).toBe(ON_BLOCK_RADIUS);
  });

  it('should carry the ball its full reach out to the right when it is halfway round the first loop', () => {
    const orbit = computePinkballOrbit(HALF_LOOP_ANGLE);

    expect(orbit.radius).toBeCloseTo(FIREBALL_ORBIT_RADIUS, PRECISION);
    expect(orbit.angle).toBeCloseTo(0, PRECISION);
  });

  it('should bring the ball back onto its block when a loop closes', () => {
    expect(computePinkballOrbit(FULL_TURN).radius).toBeCloseTo(
      ON_BLOCK_RADIUS,
      PRECISION,
    );
  });

  it('should turn each loop a sixth of a circle on from the last when it reaches out', () =>
    times(PINKBALL_LOOPS, (loop) =>
      expect(
        computePinkballOrbit(loop * FULL_TURN + HALF_LOOP_ANGLE).angle,
        `loop ${loop + 1}`,
      ).toBeCloseTo(loop * PINKBALL_LOOP_ANGLE, PRECISION),
    ));

  it('should keep the ball on a circle half the reach across when it flies one loop', () =>
    times(LOOP_SAMPLES, (step) =>
      expect(
        computeDistanceFromLoopCentre(
          toPoint(computePinkballOrbit((step * FULL_TURN) / LOOP_SAMPLES)),
        ),
        `step ${step} of ${LOOP_SAMPLES} round the loop`,
      ).toBeCloseTo(PINKBALL_LOOP_RADIUS, PRECISION),
    ));

  it('should hold the ball within its full reach when it flies the whole cycle', () => {
    expect(
      every(
        map(
          times(CYCLE_SAMPLES),
          (step) =>
            computePinkballOrbit((step * PINKBALL_CYCLE_ANGLE) / CYCLE_SAMPLES)
              .radius,
        ),
        (radius) =>
          radius >= ON_BLOCK_RADIUS && radius <= FIREBALL_ORBIT_RADIUS,
      ),
    ).toBe(true);
  });

  it('should pick the ball up where it left off when the angle runs past the cycle', () => {
    expect(
      computePinkballOrbit(PINKBALL_CYCLE_ANGLE + PAST_CYCLE_ANGLE),
    ).toEqual(computePinkballOrbit(PAST_CYCLE_ANGLE));
  });

  it('should take six loops to close the whole path when the ball is flown from the start', () => {
    expect(PINKBALL_CYCLE_ANGLE / FULL_TURN).toBe(PINKBALL_LOOPS);
  });
});
