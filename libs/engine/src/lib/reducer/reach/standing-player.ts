import type { Player } from '@mander/model';
import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import { BASE_HEARTS } from '../player/consts';

export const standingPlayer = (x: number, y: number): Player => ({
  position: { x, y },
  velocity: createBasePlayerVelocity(),
  hearts: { value: BASE_HEARTS },
  statuses: {
    isFacingRight: true,
    isGrounded: true,
    isJumpQueued: false,
  },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
});
