import type { Enemy } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createHeldShooterShot } from './create-held-shooter-shot';

const SHOOTER: Enemy = {
  kind: 'SHOOTER',
  position: { x: 320, y: 64 },
  velocity: {
    x: { current: 0, max: 39 },
    y: { current: 0, max: 301 },
  },
  timers: { death: null, reload: 2 },
  spawn: { x: 320, y: 64 },
  statuses: { isFacingRight: true, isGrounded: true },
};

describe('createHeldShooterShot', () => {
  it('should hand back the same shooter when the shot is held', () => {
    const shot = createHeldShooterShot(SHOOTER);

    expect(shot.enemy).toBe(SHOOTER);
  });

  it('should fire nothing when the shot is held', () => {
    const shot = createHeldShooterShot(SHOOTER);

    expect(shot.cannonball).toBeUndefined();
  });
});
