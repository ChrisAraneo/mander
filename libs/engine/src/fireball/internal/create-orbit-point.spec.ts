import type { Point } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { FULL_TURN, QUARTER_TURN } from '../consts';
import { createOrbitPoint } from './create-orbit-point';

const PRECISION = 6;

const ORIGIN: Point = { x: 100, y: 200 };

const REACH = 40;

describe('createOrbitPoint', () => {
  it('should put the ball to the right of its block when it has not turned yet', () => {
    const at = createOrbitPoint(ORIGIN, { radius: REACH, angle: 0 });

    expect(at).toEqual({ x: ORIGIN.x + REACH, y: ORIGIN.y });
  });

  it('should put the ball below its block when it has turned a quarter of the way round', () => {
    const at = createOrbitPoint(ORIGIN, {
      radius: REACH,
      angle: QUARTER_TURN,
    });

    expect(at.x).toBeCloseTo(ORIGIN.x, PRECISION);
    expect(at.y).toBeCloseTo(ORIGIN.y + REACH, PRECISION);
  });

  it('should bring the ball back to where it started when it has turned the whole way round', () => {
    const at = createOrbitPoint(ORIGIN, { radius: REACH, angle: FULL_TURN });

    expect(at.x).toBeCloseTo(ORIGIN.x + REACH, PRECISION);
    expect(at.y).toBeCloseTo(ORIGIN.y, PRECISION);
  });

  it('should sit the ball on its block when it has no reach at all', () => {
    const at = createOrbitPoint(ORIGIN, { radius: 0, angle: QUARTER_TURN });

    expect(at.x).toBeCloseTo(ORIGIN.x, PRECISION);
    expect(at.y).toBeCloseTo(ORIGIN.y, PRECISION);
  });
});
