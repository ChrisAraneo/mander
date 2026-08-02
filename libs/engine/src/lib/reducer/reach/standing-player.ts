import type { Player } from '@mander/model';
import { capabilitiesFor } from '../player/capabilities-for';
import { BASE_HEARTS } from '../player/consts';

export const standingPlayer = (x: number, y: number): Player => ({
  position: { x, y },
  velocity: capabilitiesFor(),
  hearts: { value: BASE_HEARTS },
  statuses: {
    isFacingRight: true,
    isGrounded: true,
    isJumpQueued: false,
  },
  timers: { death: null, invincibility: 0 },
});
