import type { Player, Snowball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { SNOWBALL_SPEED } from '../snowball/consts';
import {
  COLD_SECONDS,
  PLAYER_MAX_JUMP_VELOCITY,
  PLAYER_MAX_MOVE_VELOCITY,
} from './consts';
import { patchChilledPlayer } from './patch-chilled-player';

const HEARTS = 3;

const NO_COLD = 0;

const PART_OF_THE_COLD = 0.1;

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

const SNOWBALL: Snowball = {
  position: { x: 105, y: 220 },
  velocity: { x: { current: SNOWBALL_SPEED, max: SNOWBALL_SPEED } },
};

describe('patchChilledPlayer', () => {
  it('should hand the same player back when no snowball landed', () => {
    const player = createPlayerWithCold(NO_COLD);

    expect(patchChilledPlayer(player, [])).toBe(player);
  });

  it('should put the whole cold on the player when a snowball landed', () => {
    const chilled = patchChilledPlayer(createPlayerWithCold(NO_COLD), [
      SNOWBALL,
    ]);

    expect(chilled.timers.cold).toBe(COLD_SECONDS);
  });

  it('should set the cold back to the whole time when a snowball lands on an already cold player', () => {
    const chilled = patchChilledPlayer(createPlayerWithCold(PART_OF_THE_COLD), [
      SNOWBALL,
    ]);

    expect(chilled.timers.cold).toBe(COLD_SECONDS);
  });

  it('should take no hearts and leave the other timers alone when a snowball landed', () => {
    const player = createPlayerWithCold(NO_COLD);

    const chilled = patchChilledPlayer(player, [SNOWBALL]);

    expect(chilled.hearts).toBe(player.hearts);
    expect(chilled.timers.death).toBeNull();
    expect(chilled.timers.invincibility).toBe(0);
    expect(chilled.timers.star).toBe(0);
    expect(chilled.timers.hurt).toBe(0);
  });

  it('should keep the place and the walk of the player when a snowball landed', () => {
    const player = createPlayerWithCold(NO_COLD);

    const chilled = patchChilledPlayer(player, [SNOWBALL]);

    expect(chilled.position).toBe(player.position);
    expect(chilled.velocity).toBe(player.velocity);
    expect(chilled.statuses).toBe(player.statuses);
  });

  it('should leave the player it was handed untouched when a snowball landed', () => {
    const player = createPlayerWithCold(NO_COLD);

    patchChilledPlayer(player, [SNOWBALL]);

    expect(player).toEqual(createPlayerWithCold(NO_COLD));
  });
});
