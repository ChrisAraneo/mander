import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { INVINCIBLE_PULSES_PER_SECOND } from '../consts';
import { createPlayerAlphaStep } from './create-player-alpha-step';

const HALF_PULSE_SECONDS = 1 / INVINCIBLE_PULSES_PER_SECOND / 2;

const createTestPlayer = (invincibility: number): Player => ({
  position: { x: 64, y: 96 },
  velocity: { x: { current: 0, max: 220 }, y: { current: 0, max: 400 } },
  hearts: { value: 3 },
  timers: { death: null, invincibility, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('createPlayerAlphaStep', () => {
  it('should set how see-through the player is when the player is invincible', () => {
    const calls = drawRecorded(createPlayerAlphaStep(createTestPlayer(1), 0));

    expect(calls).toEqual(['set globalAlpha(1)']);
  });

  it('should fade the player when the invincible player is halfway through a pulse', () => {
    const calls = drawRecorded(
      createPlayerAlphaStep(createTestPlayer(1), HALF_PULSE_SECONDS),
    );

    expect(calls).toEqual(['set globalAlpha(0.3)']);
  });

  it('should draw nothing when the player is not invincible', () => {
    expect(drawRecorded(createPlayerAlphaStep(createTestPlayer(0), 0))).toEqual(
      [],
    );
  });
});
