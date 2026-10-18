import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import {
  PLAYER_DEATH_LAUNCH_VELOCITY,
  PLAYER_MAX_JUMP_VELOCITY,
  PLAYER_MAX_MOVE_VELOCITY,
} from './consts';
import { startPlayerDeath } from './start-player-death';

const createRunningPlayer = (): Player => ({
  position: { x: 100, y: 200 },
  velocity: {
    x: { current: 150, max: PLAYER_MAX_MOVE_VELOCITY },
    y: { current: -200, max: PLAYER_MAX_JUMP_VELOCITY },
  },
  hearts: { value: 2 },
  timers: { death: null, invincibility: 1, star: 0.5, hurt: 0.1 },
  statuses: { isFacingRight: false, isGrounded: true, isJumpQueued: true },
});

describe('startPlayerDeath', () => {
  it('should stop the player and throw the player upwards when the player starts dying', () => {
    const player = createRunningPlayer();

    const dying = startPlayerDeath(player);

    expect(dying).toEqual({
      position: { x: 100, y: 200 },
      velocity: {
        x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
        y: {
          current: -PLAYER_DEATH_LAUNCH_VELOCITY,
          max: PLAYER_MAX_JUMP_VELOCITY,
        },
      },
      hearts: { value: 2 },
      timers: { death: 0, invincibility: 1, star: 0.5, hurt: 0.1 },
      statuses: {
        isFacingRight: false,
        isGrounded: false,
        isJumpQueued: false,
      },
    });
  });

  it('should leave the given player unchanged when the player starts dying', () => {
    const player = createRunningPlayer();

    startPlayerDeath(player);

    expect(player).toEqual(createRunningPlayer());
  });
});
