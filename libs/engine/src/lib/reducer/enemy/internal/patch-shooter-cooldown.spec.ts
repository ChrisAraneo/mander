import type { Enemy } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchShooterCooldown } from './patch-shooter-cooldown';

const createShooter = (reload: number): Enemy => ({
  kind: 'SHOOTER',
  position: { x: 320, y: 64 },
  velocity: {
    x: { current: 0, max: 39 },
    y: { current: 0, max: 301 },
  },
  timers: { death: null, reload },
  spawn: { x: 320, y: 64 },
  statuses: { isFacingRight: true, isGrounded: true },
});

describe('patchShooterCooldown', () => {
  it('should count down the reload by the time that passed when the shooter is loading', () => {
    const cooled = patchShooterCooldown(createShooter(10), 0.5);

    expect(cooled.timers).toEqual({ death: null, reload: 9.5 });
  });

  it('should let the reload drop below zero when more time passes than was left', () => {
    const cooled = patchShooterCooldown(createShooter(0.2), 0.5);

    expect(cooled.timers.reload).toBeCloseTo(-0.3, 6);
  });

  it('should keep the death clock when it counts down the reload', () => {
    const shooter = {
      ...createShooter(10),
      timers: { death: 0.2, reload: 10 },
    };

    const cooled = patchShooterCooldown(shooter, 0.5);

    expect(cooled.timers.death).toBe(0.2);
  });

  it('should keep the position and the walk when it counts down the reload', () => {
    const shooter = createShooter(10);

    const cooled = patchShooterCooldown(shooter, 0.5);

    expect(cooled.position).toBe(shooter.position);
    expect(cooled.velocity).toBe(shooter.velocity);
    expect(cooled.statuses).toBe(shooter.statuses);
  });

  it('should leave the given shooter alone when it counts down the reload', () => {
    const shooter = createShooter(10);

    patchShooterCooldown(shooter, 0.5);

    expect(shooter).toEqual(createShooter(10));
  });
});
