import type { Player } from '@mander/model';
import { BASE_HEARTS } from '../../player/consts';
import { createBasePlayerVelocity } from '../../player/create-base-player-velocity';

export const createStandingPlayer = (left: number, top: number): Player => ({
  position: { x: left, y: top },
  velocity: createBasePlayerVelocity(),
  hearts: { value: BASE_HEARTS },
  statuses: {
    isFacingRight: true,
    isGrounded: true,
    isJumpQueued: false,
  },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
});
