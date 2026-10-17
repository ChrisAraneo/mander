import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { STOMP_BOUNCE_VELOCITY } from '../../player/consts';
import { computeBounceVelocity } from './compute-bounce-velocity';

const PLAYER: Player = {
  position: { x: 100, y: 200 },
  velocity: {
    x: { current: 0, max: 210 },
    y: { current: 150, max: 500 },
  },
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
  statuses: { isFacingRight: true, isGrounded: false, isJumpQueued: false },
};

describe('computeBounceVelocity', () => {
  it('should bounce the player up at full jump speed when the jump is held', () => {
    const velocity = computeBounceVelocity(true, PLAYER);

    expect(velocity).toBe(-500);
  });

  it('should bounce the player up at stomp speed when the jump is not held', () => {
    const velocity = computeBounceVelocity(false, PLAYER);

    expect(velocity).toBe(-STOMP_BOUNCE_VELOCITY);
  });
});
