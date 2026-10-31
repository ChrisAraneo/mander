import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isPlayerCold } from './is-player-cold';

const createTestPlayer = (cold: number, death: number | null): Player => ({
  position: { x: 64, y: 96 },
  velocity: { x: { current: 0, max: 220 }, y: { current: 0, max: 400 } },
  hearts: { value: 3 },
  timers: { death, invincibility: 0, star: 0, hurt: 0, cold },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('isPlayerCold', () => {
  it('should look cold when a snowball has just landed and the player is alive', () => {
    const result = isPlayerCold(createTestPlayer(1.5, null));

    expect(result).toBe(true);
  });

  it('should not look cold when the cold has worn off', () => {
    const result = isPlayerCold(createTestPlayer(0, null));

    expect(result).toBe(false);
  });

  it('should not look cold when the chilled player is dying', () => {
    const result = isPlayerCold(createTestPlayer(1.5, 0.2));

    expect(result).toBe(false);
  });
});
