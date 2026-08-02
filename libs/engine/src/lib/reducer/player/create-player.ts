import type { Level, Player } from '@mander/model';

import { spawnPosition } from './spawn-position';

type PlayerAttributes = Pick<Player, 'hearts' | 'velocity'>;

export const createPlayer = (
  level: Level,
  { hearts, velocity }: PlayerAttributes,
): Player => {
  const spawn = spawnPosition(level);

  return {
    position: { x: spawn.x, y: spawn.y },
    velocity: {
      x: { current: 0, max: velocity.x.max },
      y: { current: 0, max: velocity.y.max },
    },
    hearts: { value: hearts.value },
    timers: { death: null, invincibility: 0 },
    statuses: {
      isFacingRight: true,
      isGrounded: false,
      isJumpQueued: false,
    },
  };
};
