import { every, map, times } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import {
  FIREBALL_ORBIT_RADIUS,
  PINKBALL_LOOPS,
  PINKBALL_LOOP_RADIUS,
} from '../consts';
import { computeGermOrbit } from './compute-germ-orbit';
import { FULL_TURN, GERM_CYCLE_ANGLE, GERM_LOOP_ANGLE } from './consts';

const toPoint = (angle: number): { x: number; y: number } =>
  pipe(computeGermOrbit(angle), (orbit) => ({
    x: Math.cos(orbit.angle) * orbit.radius,
    y: Math.sin(orbit.angle) * orbit.radius,
  }));

describe('computeGermOrbit', () => {
  it('should sit the ball on its block when a loop begins', () => {
    expect(computeGermOrbit(0).radius).toBe(0);
  });

  it('should carry the ball its full reach out to the right when it is halfway round the first loop', () => {
    const orbit = computeGermOrbit(Math.PI);

    expect(orbit.radius).toBeCloseTo(FIREBALL_ORBIT_RADIUS, 10);
    expect(orbit.angle).toBeCloseTo(0, 10);
  });

  it('should bring the ball back onto its block when a loop closes', () => {
    expect(computeGermOrbit(FULL_TURN).radius).toBeCloseTo(0, 10);
  });

  it('should turn each loop a sixth of a circle on from the last when it reaches out', () =>
    times(PINKBALL_LOOPS, (loop) =>
      expect(
        computeGermOrbit(loop * FULL_TURN + Math.PI).angle,
        `loop ${loop + 1}`,
      ).toBeCloseTo(loop * GERM_LOOP_ANGLE, 10),
    ));

  it('should keep the ball on a circle half the reach across when it flies one loop', () =>
    times(24, (step) =>
      expect(
        pipe(toPoint((step * FULL_TURN) / 24), (at) =>
          Math.hypot(at.x - PINKBALL_LOOP_RADIUS, at.y),
        ),
        `a ${step}/24 of the way round`,
      ).toBeCloseTo(PINKBALL_LOOP_RADIUS, 10),
    ));

  it('should hold the ball within its full reach wherever it is on the germ', () => {
    expect(
      every(
        map(
          times(720),
          (step) => computeGermOrbit((step * GERM_CYCLE_ANGLE) / 720).radius,
        ),
        (radius) => radius >= 0 && radius <= FIREBALL_ORBIT_RADIUS,
      ),
    ).toBe(true);
  });

  it('should pick the germ up where it left off when the angle runs past the cycle', () => {
    expect(computeGermOrbit(GERM_CYCLE_ANGLE + 1)).toEqual(computeGermOrbit(1));
  });

  it('should take six loops to draw the whole germ when it is flown from the start', () => {
    expect(GERM_CYCLE_ANGLE / FULL_TURN).toBe(PINKBALL_LOOPS);
  });
});
