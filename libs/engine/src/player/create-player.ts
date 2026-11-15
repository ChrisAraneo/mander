import type { Level, Player } from '@mander/model';
import { computeSpawnPosition } from './compute-spawn-position';
import { createBasePlayerVelocity } from './create-base-player-velocity';
import type { PlayerAttributes } from './types/player-attributes';

export const createPlayer = (
  level: Level,
  { hearts }: PlayerAttributes,
): Player => ({
  position: computeSpawnPosition(level),
  velocity: createBasePlayerVelocity(),
  hearts: { value: hearts.value },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: {
    isFacingRight: true,
    isGrounded: false,
    isJumpQueued: false,
  },
});
