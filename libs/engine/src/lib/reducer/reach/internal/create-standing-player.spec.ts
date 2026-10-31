import { describe, expect, it } from 'vitest';

import { BASE_HEARTS } from '../../player/consts';
import { createBasePlayerVelocity } from '../../player/create-base-player-velocity';
import { createStandingPlayer } from './create-standing-player';

describe('createStandingPlayer', () => {
  it('should give a fresh player on the ground at the given spot when it is given a left and a top edge', () => {
    const player = createStandingPlayer(37, 16);

    expect(player).toEqual({
      position: { x: 37, y: 16 },
      velocity: createBasePlayerVelocity(),
      hearts: { value: BASE_HEARTS },
      statuses: {
        isFacingRight: true,
        isGrounded: true,
        isJumpQueued: false,
      },
      timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
    });
  });
});
