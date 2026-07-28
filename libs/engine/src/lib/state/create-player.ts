import type { Player } from '@mander/model';

import type { Level } from '../world';

type PlayerAttributes = Pick<Player, 'hearts' | 'velocity'>;

export const createPlayer = (
  level: Level,
  { hearts, velocity }: PlayerAttributes,
): Player => ({
  position: { x: level.spawn.x, y: level.spawn.y },
  velocity: {
    x: { current: 0, max: velocity.x.max },
    y: { current: 0, max: velocity.y.max },
  },
  hearts: { value: hearts.value },
  statuses: {
    isFacingRight: true,
    isGrounded: false,
    isJumpQueued: false,
  },
  timers: { death: null, invincibility: 0 },
});
