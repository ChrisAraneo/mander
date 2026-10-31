import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computePlayerSwing } from './compute-player-swing';

const createTestPlayer = (
  speed: number,
  isGrounded: boolean,
  death: number | null,
): Player => ({
  position: { x: 64, y: 96 },
  velocity: { x: { current: speed, max: 220 }, y: { current: 0, max: 400 } },
  hearts: { value: 3 },
  timers: { death, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded, isJumpQueued: false },
});

describe('computePlayerSwing', () => {
  it('should swing the legs with the clock when the player walks on the ground', () => {
    const result = computePlayerSwing(createTestPlayer(120, true, null), 0.1);

    expect(result).toBeCloseTo(Math.sin(0.1 * 14) * 5, 6);
  });

  it('should not swing the legs when the player stands still', () => {
    const result = computePlayerSwing(createTestPlayer(0, true, null), 0.1);

    expect(result).toBe(0);
  });

  it('should not swing the legs when the player barely moves', () => {
    const result = computePlayerSwing(createTestPlayer(1, true, null), 0.1);

    expect(result).toBe(0);
  });

  it('should not swing the legs when the player is in the air', () => {
    const result = computePlayerSwing(createTestPlayer(120, false, null), 0.1);

    expect(result).toBe(0);
  });
});
