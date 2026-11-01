import type { Fireball, FireballKind } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { FIREBALL_ORBIT_RADIUS } from '../consts';
import { computeFireballOrbit } from './compute-fireball-orbit';
import { computeGermOrbit } from './compute-germ-orbit';

const createFireball = (kind: FireballKind, angle: number): Fireball => ({
  kind,
  spin: 'CLOCKWISE',
  origin: { x: 100, y: 50 },
  angle,
});

describe('computeFireballOrbit', () => {
  it('should hold the fireball out on its ring at the angle it has turned to', () => {
    expect(computeFireballOrbit(createFireball('FIRE', 1))).toEqual({
      radius: FIREBALL_ORBIT_RADIUS,
      angle: 1,
    });
  });

  it('should hold the ice ball out on the same ring when it has turned the same way', () => {
    expect(computeFireballOrbit(createFireball('ICE', 1))).toEqual({
      radius: FIREBALL_ORBIT_RADIUS,
      angle: 1,
    });
  });

  it('should send the pink ball round its germ instead when it has turned the same way', () => {
    expect(computeFireballOrbit(createFireball('PINK', 1))).toEqual(
      computeGermOrbit(1),
    );
  });

  it('should keep the pink ball off the fireball ring when it is on its way out', () => {
    expect(computeFireballOrbit(createFireball('PINK', 1)).radius).toBeLessThan(
      FIREBALL_ORBIT_RADIUS,
    );
  });
});
