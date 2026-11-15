import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computePlayerCentre } from './compute-player-centre';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from './consts';
import { createBasePlayerVelocity } from './create-base-player-velocity';

const START_X = 100;

const START_Y = 200;

const HEARTS = 3;

const createStandingPlayer = (): Player => ({
  position: { x: START_X, y: START_Y },
  velocity: createBasePlayerVelocity(),
  hearts: { value: HEARTS },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('computePlayerCentre', () => {
  it('should give the middle of the player when the player stands somewhere in the level', () => {
    const centre = computePlayerCentre(createStandingPlayer());

    expect(centre).toEqual({
      x: START_X + PLAYER_WIDTH / 2,
      y: START_Y + PLAYER_HEIGHT / 2,
    });
  });

  it('should leave the player it was handed untouched when it works out the middle', () => {
    const player = createStandingPlayer();

    computePlayerCentre(player);

    expect(player).toEqual(createStandingPlayer());
  });
});
