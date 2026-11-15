import { type Enemy, TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchShooterCooldown } from './patch-shooter-cooldown';

const ENEMY_LEFT = 10 * TILE_SIZE;
const ENEMY_TOP = 2 * TILE_SIZE;
const ENEMY_TOP_MOVE_SPEED = 39;
const ENEMY_TOP_FALL_SPEED = 301;

const createShooter = (reload: number): Enemy => ({
  kind: 'SHOOTER',
  position: { x: ENEMY_LEFT, y: ENEMY_TOP },
  velocity: {
    x: { current: 0, max: ENEMY_TOP_MOVE_SPEED },
    y: { current: 0, max: ENEMY_TOP_FALL_SPEED },
  },
  timers: { death: null, reload },
  spawn: { x: ENEMY_LEFT, y: ENEMY_TOP },
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
