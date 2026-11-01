import { describe, expect, it } from 'vitest';

import {
  FIREBALL_ANGULAR_SPEED,
  FIREBALL_ORBIT_RADIUS,
  FIREBALL_ORBIT_SECONDS,
  PINKBALL_ANGULAR_SPEED,
  PINKBALL_LOOP_RADIUS,
  PINKBALL_LOOP_SECONDS,
  PINKBALL_SPEED_SCALE,
} from '../consts';
import { computeAngularSpeed } from './compute-angular-speed';

describe('computeAngularSpeed', () => {
  it('should turn the ball at the usual pace when it is a fireball', () => {
    expect(computeAngularSpeed('FIRE')).toBe(FIREBALL_ANGULAR_SPEED);
  });

  it('should turn the ball at the usual pace when it is an ice ball', () => {
    expect(computeAngularSpeed('ICE')).toBe(FIREBALL_ANGULAR_SPEED);
  });

  it('should turn the ball slower when it is a pink ball', () => {
    expect(computeAngularSpeed('PINK')).toBe(PINKBALL_ANGULAR_SPEED);
    expect(PINKBALL_ANGULAR_SPEED).toBeLessThan(FIREBALL_ANGULAR_SPEED);
  });

  it('should dawdle the pink ball round its loop when it holds it to a fraction of its old pace', () => {
    expect(PINKBALL_LOOP_SECONDS * PINKBALL_SPEED_SCALE).toBeCloseTo(
      FIREBALL_ORBIT_SECONDS / 2,
      10,
    );
  });

  it('should carry the pink ball round its loop at a fraction of the speed the fireball keeps on its ring', () => {
    expect(PINKBALL_LOOP_RADIUS * PINKBALL_ANGULAR_SPEED).toBeCloseTo(
      PINKBALL_SPEED_SCALE * FIREBALL_ORBIT_RADIUS * FIREBALL_ANGULAR_SPEED,
      10,
    );
  });
});
