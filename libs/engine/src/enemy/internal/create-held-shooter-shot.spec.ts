import { type Enemy, TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createHeldShooterShot } from './create-held-shooter-shot';

const ENEMY_LEFT = 10 * TILE_SIZE;
const ENEMY_TOP = 2 * TILE_SIZE;
const ENEMY_TOP_MOVE_SPEED = 39;
const ENEMY_TOP_FALL_SPEED = 301;

const SHOOTER: Enemy = {
  kind: 'SHOOTER',
  position: { x: ENEMY_LEFT, y: ENEMY_TOP },
  velocity: {
    x: { current: 0, max: ENEMY_TOP_MOVE_SPEED },
    y: { current: 0, max: ENEMY_TOP_FALL_SPEED },
  },
  timers: { death: null, reload: 2 },
  spawn: { x: ENEMY_LEFT, y: ENEMY_TOP },
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
