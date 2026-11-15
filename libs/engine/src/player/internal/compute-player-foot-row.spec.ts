import { type Player, TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { PLAYER_HEIGHT } from '../consts';
import { createBasePlayerVelocity } from '../create-base-player-velocity';
import { computePlayerFootRow } from './compute-player-foot-row';

const HEARTS = 3;

const FLOOR_ROW = 2;

const FLOOR_Y = FLOOR_ROW * TILE_SIZE - PLAYER_HEIGHT;

const HIGH_ROW = 0;

const createPlayerAt = (positionY: number): Player => ({
  position: { x: 0, y: positionY },
  velocity: createBasePlayerVelocity(),
  hearts: { value: HEARTS },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('computePlayerFootRow', () => {
  it('should give the row just under the feet when the player stands on the floor', () => {
    expect(computePlayerFootRow(createPlayerAt(FLOOR_Y))).toBe(FLOOR_ROW);
  });

  it('should give the top row when the player is right at the top of the level', () => {
    expect(computePlayerFootRow(createPlayerAt(-PLAYER_HEIGHT))).toBe(HIGH_ROW);
  });

  it('should leave the player it was handed untouched when it looks under their feet', () => {
    const player = createPlayerAt(FLOOR_Y);

    computePlayerFootRow(player);

    expect(player).toEqual(createPlayerAt(FLOOR_Y));
  });
});
