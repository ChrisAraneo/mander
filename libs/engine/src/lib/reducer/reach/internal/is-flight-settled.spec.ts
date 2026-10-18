import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { MAX_GROUNDED_FRAMES, MAX_PLAN_FRAMES } from '../consts';
import { createStandingPlayer } from './create-standing-player';
import { isFlightSettled } from './is-flight-settled';

const createAirbornePlayer = (left: number, top: number): Player => ({
  ...createStandingPlayer(left, top),
  statuses: { ...createStandingPlayer(left, top).statuses, isGrounded: false },
});

const GROUNDED_PLAYER = createStandingPlayer(40, 16);

const AIRBORNE_PLAYER = createAirbornePlayer(40, 10);

describe('isFlightSettled', () => {
  it('should be settled when the player lands this frame', () => {
    const isSettled = isFlightSettled(AIRBORNE_PLAYER, GROUNDED_PLAYER, 0);

    expect(isSettled).toBe(true);
  });

  it('should be settled when the player has stood on the ground for the most grounded frames', () => {
    const isSettled = isFlightSettled(
      GROUNDED_PLAYER,
      GROUNDED_PLAYER,
      MAX_GROUNDED_FRAMES - 1,
    );

    expect(isSettled).toBe(true);
  });

  it('should not be settled when the player has stood on the ground for fewer than the most grounded frames', () => {
    const isSettled = isFlightSettled(
      GROUNDED_PLAYER,
      GROUNDED_PLAYER,
      MAX_GROUNDED_FRAMES - 2,
    );

    expect(isSettled).toBe(false);
  });

  it('should be settled when the player is still in the air on the last frame of the plan', () => {
    const isSettled = isFlightSettled(
      AIRBORNE_PLAYER,
      AIRBORNE_PLAYER,
      MAX_PLAN_FRAMES - 1,
    );

    expect(isSettled).toBe(true);
  });

  it('should not be settled when the player is in the air before the last frame of the plan', () => {
    const isSettled = isFlightSettled(
      AIRBORNE_PLAYER,
      AIRBORNE_PLAYER,
      MAX_PLAN_FRAMES - 2,
    );

    expect(isSettled).toBe(false);
  });
});
