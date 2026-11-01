import type { Fireball, FireballKind } from '@mander/model';
import { every, map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FIREBALL_ORBIT_RADIUS, PINKBALL_SPIRAL_RADIUS } from '../consts';
import { computeFireballRadius } from './compute-fireball-radius';
import { SPIRAL_ARM_ANGLE, SPIRAL_CYCLE_ANGLE } from './consts';

const createFireball = (kind: FireballKind, angle: number): Fireball => ({
  kind,
  spin: 'CLOCKWISE',
  origin: { x: 100, y: 100 },
  angle,
});

describe('computeFireballRadius', () => {
  it('should hold the fireball on the one orbit wherever it has got to', () => {
    expect(
      map(times(8), (step) =>
        computeFireballRadius(
          createFireball('FIRE', (step * SPIRAL_CYCLE_ANGLE) / 8),
        ),
      ),
    ).toEqual(map(times(8), () => FIREBALL_ORBIT_RADIUS));
  });

  it('should hold the ice ball on the one orbit wherever it has got to', () => {
    expect(computeFireballRadius(createFireball('ICE', SPIRAL_ARM_ANGLE))).toBe(
      FIREBALL_ORBIT_RADIUS,
    );
  });

  it('should hold the pink ball out on the orbit when its spiral starts', () => {
    expect(computeFireballRadius(createFireball('PINK', 0))).toBe(
      FIREBALL_ORBIT_RADIUS,
    );
  });

  it('should wind the pink ball in to its closest point when it has turned one arm of the spiral', () => {
    expect(
      computeFireballRadius(createFireball('PINK', SPIRAL_ARM_ANGLE)),
    ).toBeCloseTo(FIREBALL_ORBIT_RADIUS - PINKBALL_SPIRAL_RADIUS, 10);
  });

  it('should wind the pink ball back out when it has turned the whole cycle', () => {
    expect(
      computeFireballRadius(createFireball('PINK', SPIRAL_CYCLE_ANGLE)),
    ).toBeCloseTo(FIREBALL_ORBIT_RADIUS, 10);
  });

  it('should move the pink ball in by the same step for every same step of the turn', () => {
    expect(
      map(times(4), (step) =>
        Math.round(
          computeFireballRadius(
            createFireball('PINK', ((step + 1) * SPIRAL_ARM_ANGLE) / 4),
          ) -
            computeFireballRadius(
              createFireball('PINK', (step * SPIRAL_ARM_ANGLE) / 4),
            ),
        ),
      ),
    ).toEqual(map(times(4), () => -PINKBALL_SPIRAL_RADIUS / 4));
  });

  it('should never swing the pink ball further out than the fireball orbit', () => {
    expect(
      every(
        times(720, (step) =>
          computeFireballRadius(createFireball('PINK', (step * Math.PI) / 180)),
        ),
        (radius) =>
          radius <= FIREBALL_ORBIT_RADIUS &&
          radius >= FIREBALL_ORBIT_RADIUS - PINKBALL_SPIRAL_RADIUS,
      ),
    ).toBe(true);
  });
});
