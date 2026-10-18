import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { HURT_PLAYER_COLORS, PLAYER_COLORS } from '../consts';
import { getPlayerBodyColors } from './get-player-body-colors';

const createTestPlayer = (hurt: number, death: number | null): Player => ({
  position: { x: 64, y: 96 },
  velocity: { x: { current: 0, max: 220 }, y: { current: 0, max: 400 } },
  hearts: { value: 3 },
  timers: { death, invincibility: 0, star: 0, hurt },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('getPlayerBodyColors', () => {
  it('should give the hurt colours when the player is flashing', () => {
    const result = getPlayerBodyColors(createTestPlayer(0.5, null));

    expect(result).toBe(HURT_PLAYER_COLORS);
  });

  it('should give the usual colours when the player is not flashing', () => {
    const result = getPlayerBodyColors(createTestPlayer(0, null));

    expect(result).toBe(PLAYER_COLORS);
  });
});
