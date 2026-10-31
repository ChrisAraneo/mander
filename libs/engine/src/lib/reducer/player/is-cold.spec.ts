import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isCold } from './is-cold';

const createPlayerWithCold = (cold: number): Player => ({
  position: { x: 100, y: 200 },
  velocity: {
    x: { current: 0, max: 210 },
    y: { current: 0, max: 500 },
  },
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('isCold', () => {
  it('should call the player cold when the cold timer is still running', () => {
    expect(isCold(createPlayerWithCold(1.5))).toBe(true);
  });

  it('should call the player cold when a sliver of the cold timer is left', () => {
    expect(isCold(createPlayerWithCold(0.001))).toBe(true);
  });

  it('should not call the player cold when the cold timer has run out', () => {
    expect(isCold(createPlayerWithCold(0))).toBe(false);
  });
});
