import type { Fireball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computeGermOrbit } from './compute-germ-orbit';
import { GERM_CYCLE_ANGLE, GERM_HALF_CYCLE_ANGLE } from './consts';
import { toCounterGerm } from './to-counter-germ';

const GERM: Fireball = {
  kind: 'PINK',
  spin: 'CLOCKWISE',
  origin: { x: 48, y: 16 },
  angle: 1,
};

describe('toCounterGerm', () => {
  it('should send the twin round the other way when it pairs it up', () => {
    expect(toCounterGerm(GERM).spin).toBe('ANTICLOCKWISE');
  });

  it('should send the twin of an anticlockwise germ round clockwise when it pairs it up', () => {
    expect(toCounterGerm({ ...GERM, spin: 'ANTICLOCKWISE' }).spin).toBe(
      'CLOCKWISE',
    );
  });

  it('should hang the twin on the same block when it pairs it up', () => {
    expect(toCounterGerm(GERM).origin).toEqual(GERM.origin);
  });

  it('should keep the twin a pink ball when it pairs it up', () => {
    expect(toCounterGerm(GERM).kind).toBe('PINK');
  });

  it('should set the twin off half a germ on when it pairs it up', () => {
    expect(toCounterGerm(GERM).angle).toBeCloseTo(1 + GERM_HALF_CYCLE_ANGLE, 6);
  });

  it('should keep the twin within one germ cycle when the germ is past halfway', () => {
    expect(
      toCounterGerm({ ...GERM, angle: GERM_CYCLE_ANGLE - 1 }).angle,
    ).toBeCloseTo(GERM_HALF_CYCLE_ANGLE - 1, 6);
  });

  it('should hold the twin as far out as the germ when it pairs it up', () => {
    expect(computeGermOrbit(toCounterGerm(GERM).angle).radius).toBeCloseTo(
      computeGermOrbit(GERM.angle).radius,
      10,
    );
  });

  it('should stand the twin on the far side of the block when it pairs it up', () => {
    expect(
      Math.cos(
        computeGermOrbit(toCounterGerm(GERM).angle).angle -
          computeGermOrbit(GERM.angle).angle,
      ),
    ).toBeCloseTo(-1, 10);
  });

  it('should bring the germ back when the twin is paired up again', () => {
    expect(toCounterGerm(toCounterGerm(GERM))).toEqual({
      ...GERM,
      angle: expect.closeTo(GERM.angle, 6),
    });
  });
});
