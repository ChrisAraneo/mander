import type { Player } from '../state';
import { PLAYER_DEATH_LAUNCH_VELOCITY } from '../state';

export const killPlayer = (player: Player): Player => ({
  ...player,
  vx: 0,
  vy: -PLAYER_DEATH_LAUNCH_VELOCITY,
  isGrounded: false,
  isJumpQueued: false,
  dyingFor: 0,
});
