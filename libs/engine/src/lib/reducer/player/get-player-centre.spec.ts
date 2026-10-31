import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { PLAYER_HEIGHT, PLAYER_WIDTH } from './consts';
import { createBasePlayerVelocity } from './create-base-player-velocity';
import { getPlayerCentre } from './get-player-centre';

const PLAYER: Player = {
  position: { x: 100, y: 200 },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
};

describe('getPlayerCentre', () => {
  it('should give the middle of the player when the player stands somewhere in the level', () => {
    const centre = getPlayerCentre(PLAYER);

    expect(centre).toEqual({
      x: 100 + PLAYER_WIDTH / 2,
      y: 200 + PLAYER_HEIGHT / 2,
    });
    expect(centre).toEqual({ x: 111, y: 224 });
  });
});
