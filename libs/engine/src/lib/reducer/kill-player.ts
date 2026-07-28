import type { Player } from '../state';
import { PLAYER_DEATH_LAUNCH_VELOCITY } from '../state';

export const killPlayer = (player: Player): Player => ({
  ...player,
  velocity: {
    x: { ...player.velocity.x, current: 0 },
    y: { ...player.velocity.y, current: -PLAYER_DEATH_LAUNCH_VELOCITY },
  },
  statuses: {
    ...player.statuses,
    isGrounded: false,
    isJumpQueued: false,
  },
  timers: { ...player.timers, death: 0 },
});
