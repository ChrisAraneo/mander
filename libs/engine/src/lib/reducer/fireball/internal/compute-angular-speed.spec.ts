import { describe, expect, it } from 'vitest';

import {
  FIREBALL_ANGULAR_SPEED,
  FIREBALL_ORBIT_RADIUS,
  FIREBALL_ORBIT_SECONDS,
  PINKBALL_ANGULAR_SPEED,
  PINKBALL_LOOP_RADIUS,
  PINKBALL_LOOP_SECONDS,
} from '../consts';
import { computeAngularSpeed } from './compute-angular-speed';

describe('computeAngularSpeed', () => {
  it('should turn the ball at the usual pace when it is a fireball', () => {
    expect(computeAngularSpeed('FIRE')).toBe(FIREBALL_ANGULAR_SPEED);
  });

  it('should turn the ball at the usual pace when it is an ice ball', () => {
    expect(computeAngularSpeed('ICE')).toBe(FIREBALL_ANGULAR_SPEED);
  });

  it('should turn the ball faster when it is a pink ball', () => {
    expect(computeAngularSpeed('PINK')).toBe(PINKBALL_ANGULAR_SPEED);
    expect(PINKBALL_ANGULAR_SPEED).toBeGreaterThan(FIREBALL_ANGULAR_SPEED);
  });

  it('should take the pink ball round its loop while the fireball goes half way round its ring', () => {
    expect(FIREBALL_ORBIT_SECONDS / PINKBALL_LOOP_SECONDS).toBe(2);
  });

  it('should carry the pink ball round its loop at the very speed the fireball keeps on its ring', () => {
    expect(PINKBALL_LOOP_RADIUS * PINKBALL_ANGULAR_SPEED).toBeCloseTo(
      FIREBALL_ORBIT_RADIUS * FIREBALL_ANGULAR_SPEED,
      10,
    );
  });
});
