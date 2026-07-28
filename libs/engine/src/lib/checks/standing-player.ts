import { BASE_HEARTS, capabilitiesFor } from '../state';
import type { Player } from '../state';

export const standingPlayer = (x: number, y: number): Player => ({
  position: { x, y },
  velocity: capabilitiesFor([]),
  hearts: { value: BASE_HEARTS },
  statuses: {
    isFacingRight: true,
    isGrounded: true,
    isJumpQueued: false,
  },
  timers: { death: null, invincibility: 0 },
});
