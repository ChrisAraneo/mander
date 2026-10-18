import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isPlayerFlashing } from './is-player-flashing';

const createTestPlayer = (hurt: number, death: number | null): Player => ({
  position: { x: 64, y: 96 },
  velocity: { x: { current: 0, max: 220 }, y: { current: 0, max: 400 } },
  hearts: { value: 3 },
  timers: { death, invincibility: 0, star: 0, hurt },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('isPlayerFlashing', () => {
  it('should flash when the player has just been hurt and is alive', () => {
    const result = isPlayerFlashing(createTestPlayer(0.5, null));

    expect(result).toBe(true);
  });

  it('should not flash when the player has not been hurt', () => {
    const result = isPlayerFlashing(createTestPlayer(0, null));

    expect(result).toBe(false);
  });

  it('should not flash when the hurt player is dying', () => {
    const result = isPlayerFlashing(createTestPlayer(0.5, 0.2));

    expect(result).toBe(false);
  });
});
