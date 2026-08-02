import type { Player } from '@mander/model';

import { PLAYER_DEATH_LAUNCH_VELOCITY } from './consts';

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
