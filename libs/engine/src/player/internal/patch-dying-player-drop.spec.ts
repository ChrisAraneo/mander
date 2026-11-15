import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { PLAYER_MAX_JUMP_VELOCITY, PLAYER_MAX_MOVE_VELOCITY } from '../consts';
import { patchDyingPlayerDrop } from './patch-dying-player-drop';
import type { DyingPlayerDrop } from './types/dying-player-drop';

const START_X = 100;

const START_Y = 200;

const HEARTS = 2;

const DELTA_SECONDS = 1 / 32;

const DEATH_SECONDS = 0.25;

const FALLING_SPEED = 160;

const PULLED_SPEED = 200;

const DROPPED_Y = 205;

const createDyingPlayer = (): Player => ({
  position: { x: START_X, y: START_Y },
  velocity: {
    x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
    y: { current: FALLING_SPEED, max: PLAYER_MAX_JUMP_VELOCITY },
  },
  hearts: { value: HEARTS },
  timers: { death: DEATH_SECONDS, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: false, isJumpQueued: false },
});

const createDrop = (): DyingPlayerDrop => ({
  player: createDyingPlayer(),
  death: DEATH_SECONDS,
  deltaSeconds: DELTA_SECONDS,
  velocityY: PULLED_SPEED,
  positionY: DROPPED_Y,
});

describe('patchDyingPlayerDrop', () => {
  it('should put the dead player where they dropped to when the drop is written in', () => {
    expect(patchDyingPlayerDrop(createDrop()).position).toEqual({
      x: START_X,
      y: DROPPED_Y,
    });
  });

  it('should give the dead player the speed they picked up when the drop is written in', () => {
    expect(patchDyingPlayerDrop(createDrop()).velocity.y).toEqual({
      current: PULLED_SPEED,
      max: PLAYER_MAX_JUMP_VELOCITY,
    });
  });

  it('should count the frame towards the time spent dying when the drop is written in', () => {
    expect(patchDyingPlayerDrop(createDrop()).timers.death).toBe(
      DEATH_SECONDS + DELTA_SECONDS,
    );
  });

  it('should leave the rest of the player alone when the drop is written in', () => {
    const patched = patchDyingPlayerDrop(createDrop());

    expect(patched.hearts).toEqual({ value: HEARTS });
    expect(patched.velocity.x).toEqual({
      current: 0,
      max: PLAYER_MAX_MOVE_VELOCITY,
    });
    expect(patched.statuses).toEqual(createDyingPlayer().statuses);
  });

  it('should leave the drop it was handed untouched when the drop is written in', () => {
    const drop = createDrop();

    patchDyingPlayerDrop(drop);

    expect(drop).toEqual(createDrop());
  });
});
