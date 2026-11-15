import type { Fireball, FireballKind } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { FIREBALL_ORBIT_RADIUS } from '../consts';
import { computeFireballOrbit } from './compute-fireball-orbit';
import { computePinkballOrbit } from './compute-pinkball-orbit';

const TURNED_ANGLE = 1;

const BLOCK_CENTRE = { x: 100, y: 50 };

const createFireball = (kind: FireballKind, angle: number): Fireball => ({
  kind,
  spin: 'CLOCKWISE',
  origin: BLOCK_CENTRE,
  angle,
});

describe('computeFireballOrbit', () => {
  it('should hold the fireball out on its ring when it has turned part way round', () => {
    expect(computeFireballOrbit(createFireball('FIRE', TURNED_ANGLE))).toEqual({
      radius: FIREBALL_ORBIT_RADIUS,
      angle: TURNED_ANGLE,
    });
  });

  it('should hold the ice ball out on the same ring when it has turned the same way', () => {
    expect(computeFireballOrbit(createFireball('ICE', TURNED_ANGLE))).toEqual({
      radius: FIREBALL_ORBIT_RADIUS,
      angle: TURNED_ANGLE,
    });
  });

  it('should send the pink ball round its looping path instead when it has turned the same way', () => {
    expect(computeFireballOrbit(createFireball('PINK', TURNED_ANGLE))).toEqual(
      computePinkballOrbit(TURNED_ANGLE),
    );
  });

  it('should keep the pink ball off the fireball ring when it is on its way out', () => {
    expect(
      computeFireballOrbit(createFireball('PINK', TURNED_ANGLE)).radius,
    ).toBeLessThan(FIREBALL_ORBIT_RADIUS);
  });
});
