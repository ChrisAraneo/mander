import { BASE_HEARTS, capabilitiesFor } from '../state';
import type { Player } from '../state';

export const standingPlayer = (x: number, y: number): Player => ({
  x,
  y,
  vx: 0,
  vy: 0,
  isGrounded: true,
  facing: 1,
  isJumpQueued: false,
  dyingFor: null,
  hearts: BASE_HEARTS,
  invincibleFor: 0,
  ...capabilitiesFor([]),
});
