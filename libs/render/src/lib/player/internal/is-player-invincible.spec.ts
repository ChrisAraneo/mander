import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isPlayerInvincible } from './is-player-invincible';

const createTestPlayer = (
  invincibility: number,
  death: number | null,
): Player => ({
  position: { x: 64, y: 96 },
  velocity: { x: { current: 0, max: 220 }, y: { current: 0, max: 400 } },
  hearts: { value: 3 },
  timers: { death, invincibility, star: 0, hurt: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('isPlayerInvincible', () => {
  it('should be true when the player has invincibility time left', () => {
    expect(isPlayerInvincible(createTestPlayer(1.5, null))).toBe(true);
  });

  it('should be false when the invincibility has run out', () => {
    expect(isPlayerInvincible(createTestPlayer(0, null))).toBe(false);
  });

  it('should be false when the player is dying with invincibility time left', () => {
    expect(isPlayerInvincible(createTestPlayer(1.5, 0.2))).toBe(false);
  });
});
