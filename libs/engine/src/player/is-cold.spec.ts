import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { PLAYER_MAX_JUMP_VELOCITY, PLAYER_MAX_MOVE_VELOCITY } from './consts';
import { isCold } from './is-cold';

const HEARTS = 3;

const COLD_LEFT = 1.5;

const createPlayerWithCold = (cold: number): Player => ({
  position: { x: 100, y: 200 },
  velocity: {
    x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
    y: { current: 0, max: PLAYER_MAX_JUMP_VELOCITY },
  },
  hearts: { value: HEARTS },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('isCold', () => {
  it('should call the player cold when the cold timer is still running', () => {
    expect(isCold(createPlayerWithCold(COLD_LEFT))).toBe(true);
  });

  it('should call the player cold when a sliver of the cold timer is left', () => {
    expect(isCold(createPlayerWithCold(0.001))).toBe(true);
  });

  it('should not call the player cold when the cold timer has run out', () => {
    expect(isCold(createPlayerWithCold(0))).toBe(false);
  });

  it('should leave the player it was handed untouched when it looks at the cold', () => {
    const player = createPlayerWithCold(COLD_LEFT);

    isCold(player);

    expect(player).toEqual(createPlayerWithCold(COLD_LEFT));
  });
});
