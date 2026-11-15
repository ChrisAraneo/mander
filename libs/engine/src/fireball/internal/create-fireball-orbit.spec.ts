import { describe, expect, it } from 'vitest';

import { FIREBALL_ORBIT_RADIUS } from '../consts';
import { createFireballOrbit } from './create-fireball-orbit';

const TURNED_ANGLE = 1;

describe('createFireballOrbit', () => {
  it('should hold the ball its full reach out when it is given an angle', () => {
    expect(createFireballOrbit(TURNED_ANGLE).radius).toBe(
      FIREBALL_ORBIT_RADIUS,
    );
  });

  it('should keep the angle the ball has turned to when it is given an angle', () => {
    expect(createFireballOrbit(TURNED_ANGLE).angle).toBe(TURNED_ANGLE);
  });

  it('should hold the ball out at the start of its ring when the angle is zero', () => {
    expect(createFireballOrbit(0)).toEqual({
      radius: FIREBALL_ORBIT_RADIUS,
      angle: 0,
    });
  });
});
