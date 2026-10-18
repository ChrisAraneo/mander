import { ceil } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  PLAYER_FIREBALL_ORBIT_RADIUS,
  PLAYER_FIREBALL_SWEEP_STEP,
} from '../consts';
import { computeSweptStepCount } from './compute-swept-step-count';

describe('computeSweptStepCount', () => {
  it('should split the sweep into steps no longer than the sweep step when the fireball swept a whole radian', () => {
    const steps = computeSweptStepCount(1);

    expect(steps).toBe(
      ceil(PLAYER_FIREBALL_ORBIT_RADIUS / PLAYER_FIREBALL_SWEEP_STEP),
    );
    expect(steps).toBe(20);
  });

  it('should round the step count up when the sweep does not split evenly', () => {
    const steps = computeSweptStepCount(0.5);

    expect(steps).toBe(10);
  });

  it('should take one step when the fireball swept only a tiny angle', () => {
    const steps = computeSweptStepCount(0.01);

    expect(steps).toBe(1);
  });

  it('should still take one step when the fireball did not move', () => {
    const steps = computeSweptStepCount(0);

    expect(steps).toBe(1);
  });
});
