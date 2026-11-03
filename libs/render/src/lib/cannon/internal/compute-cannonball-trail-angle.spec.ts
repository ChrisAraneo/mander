import type { Cannonball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computeCannonballTrailAngle } from './compute-cannonball-trail-angle';

const createCannonball = (
  velocityX: number,
  velocityY: number,
): Cannonball => ({
  position: { x: 0, y: 0 },
  velocity: {
    x: { current: velocityX, max: 220 },
    y: { current: velocityY, max: 220 },
  },
});

describe('computeCannonballTrailAngle', () => {
  it('should give no angle when the ball flies level', () => {
    expect(computeCannonballTrailAngle(createCannonball(220, 0))).toBe(0);
    expect(computeCannonballTrailAngle(createCannonball(-220, 0))).toBe(0);
  });

  it('should tilt upwards when the ball climbs to the right', () => {
    expect(
      computeCannonballTrailAngle(createCannonball(100, -100)),
    ).toBeCloseTo(-Math.PI / 4);
  });

  it('should tilt the same way when the ball climbs to the left', () => {
    expect(
      computeCannonballTrailAngle(createCannonball(-100, -100)),
    ).toBeCloseTo(-Math.PI / 4);
  });

  it('should tilt downwards when the ball drops', () => {
    expect(computeCannonballTrailAngle(createCannonball(100, 100))).toBeCloseTo(
      Math.PI / 4,
    );
  });
});
