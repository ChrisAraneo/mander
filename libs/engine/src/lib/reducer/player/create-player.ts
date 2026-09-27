import type { Level, Player } from '@mander/model';

import { getSpawnPosition } from './get-spawn-position';
import type { PlayerAttributes } from './types/player-attributes';
import { createBasePlayerVelocity } from './create-base-player-velocity';

export const createPlayer = (
  level: Level,
  { hearts }: PlayerAttributes,
): Player => ({
  position: getSpawnPosition(level),
  velocity: createBasePlayerVelocity(),
  hearts: { value: hearts.value },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
  statuses: {
    isFacingRight: true,
    isGrounded: false,
    isJumpQueued: false,
  },
});
