import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { COLD_SECONDS, PLAYER_MAX_MOVE_VELOCITY } from './consts';
import { createBasePlayerVelocity } from './create-base-player-velocity';
import { patchColdPlayer } from './patch-cold-player';

const START_X = 100;

const START_Y = 200;

const HEARTS = 3;

const NO_COLD = 0;

const PART_OF_THE_COLD = 0.1;

const createPlayerWithCold = (cold: number): Player => ({
  position: { x: START_X, y: START_Y },
  velocity: createBasePlayerVelocity(),
  hearts: { value: HEARTS },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('patchColdPlayer', () => {
  it('should put the whole cold on the player when the cold is written in', () => {
    expect(patchColdPlayer(createPlayerWithCold(NO_COLD)).timers.cold).toBe(
      COLD_SECONDS,
    );
  });

  it('should set the cold back to the whole time when the player is already cold', () => {
    expect(
      patchColdPlayer(createPlayerWithCold(PART_OF_THE_COLD)).timers.cold,
    ).toBe(COLD_SECONDS);
  });

  it('should take no hearts and leave the other timers alone when the cold is written in', () => {
    const player = createPlayerWithCold(NO_COLD);

    const cold = patchColdPlayer(player);

    expect(cold.hearts).toBe(player.hearts);
    expect(cold.timers.death).toBeNull();
    expect(cold.timers.invincibility).toBe(0);
    expect(cold.timers.star).toBe(0);
    expect(cold.timers.hurt).toBe(0);
  });

  it('should keep the place and the walk of the player when the cold is written in', () => {
    const player = createPlayerWithCold(NO_COLD);

    const cold = patchColdPlayer(player);

    expect(cold.position).toBe(player.position);
    expect(cold.velocity).toBe(player.velocity);
    expect(cold.velocity.x.max).toBe(PLAYER_MAX_MOVE_VELOCITY);
    expect(cold.statuses).toBe(player.statuses);
  });

  it('should leave the player it was handed untouched when the cold is written in', () => {
    const player = createPlayerWithCold(NO_COLD);

    patchColdPlayer(player);

    expect(player).toEqual(createPlayerWithCold(NO_COLD));
  });
});
