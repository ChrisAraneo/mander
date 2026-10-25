import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import {
  HURT_PLAYER_COLORS,
  INVINCIBLE_HURT_PLAYER_COLORS,
  INVINCIBLE_OUTLINE_COLOR,
  INVINCIBLE_PLAYER_COLORS,
  PLAYER_COLORS,
} from '../consts';
import { getPlayerBodyColors } from './get-player-body-colors';

const createTestPlayer = (
  hurt: number,
  death: number | null,
  invincibility = 0,
): Player => ({
  position: { x: 64, y: 96 },
  velocity: { x: { current: 0, max: 220 }, y: { current: 0, max: 400 } },
  hearts: { value: 3 },
  timers: { death, invincibility, star: 0, hurt },
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

  it('should give the usual colours with a white outline when the player is invincible', () => {
    const result = getPlayerBodyColors(createTestPlayer(0, null, 1.5));

    expect(result).toBe(INVINCIBLE_PLAYER_COLORS);
    expect(result).toEqual({
      ...PLAYER_COLORS,
      outline: INVINCIBLE_OUTLINE_COLOR,
    });
  });

  it('should give the hurt colours with a white outline when the hurt player is invincible', () => {
    const result = getPlayerBodyColors(createTestPlayer(0.5, null, 1.5));

    expect(result).toBe(INVINCIBLE_HURT_PLAYER_COLORS);
    expect(result).toEqual({
      ...HURT_PLAYER_COLORS,
      outline: INVINCIBLE_OUTLINE_COLOR,
    });
  });

  it('should keep the dark outline when the dying player still has invincibility left', () => {
    const result = getPlayerBodyColors(createTestPlayer(0, 0.2, 1.5));

    expect(result.outline).toBe(PLAYER_COLORS.outline);
  });
});
