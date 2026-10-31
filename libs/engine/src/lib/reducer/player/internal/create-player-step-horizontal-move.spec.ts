import { type Level, type Player, TILE_AIR } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createBasePlayerVelocity } from '../create-base-player-velocity';
import { createPlayerStepHorizontalMove } from './create-player-step-horizontal-move';
import type { PlayerStepFall } from './types/player-step-fall';

const LEVEL: Level = {
  seed: 'SEED',
  width: 1,
  height: 1,
  tiles: [[TILE_AIR]],
  chestItems: [],
};

const PLAYER: Player = {
  position: { x: 40, y: 40 },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
};

const FALL: PlayerStepFall = {
  level: LEVEL,
  player: PLAYER,
  deltaSeconds: 0.04,
  velocityX: 210,
  isFacingRight: true,
  velocityY: 75,
  isGrounded: true,
};

const OPEN_MOVE = { position: 48, isBlocked: false };

describe('createPlayerStepHorizontalMove', () => {
  it('should give the new position as the next x when the move is made', () => {
    const step = createPlayerStepHorizontalMove(FALL, OPEN_MOVE);

    expect(step.nextX).toBe(48);
  });

  it('should keep the speed when the move is not blocked', () => {
    const step = createPlayerStepHorizontalMove(FALL, OPEN_MOVE);

    expect(step.blockedVelocityX).toBe(210);
  });

  it('should take away the speed when the move is blocked', () => {
    const step = createPlayerStepHorizontalMove(FALL, {
      position: 40,
      isBlocked: true,
    });

    expect(step.blockedVelocityX).toBe(0);
  });

  it('should pass the level on unchanged when the move is made', () => {
    const step = createPlayerStepHorizontalMove(FALL, OPEN_MOVE);

    expect(step.level).toBe(LEVEL);
  });

  it('should pass the player on unchanged when the move is made', () => {
    const step = createPlayerStepHorizontalMove(FALL, OPEN_MOVE);

    expect(step.player).toBe(PLAYER);
  });

  it('should pass the tick length on unchanged when the move is made', () => {
    const step = createPlayerStepHorizontalMove(FALL, OPEN_MOVE);

    expect(step.deltaSeconds).toBe(0.04);
  });

  it('should pass the facing on unchanged when the move is made', () => {
    const step = createPlayerStepHorizontalMove(FALL, OPEN_MOVE);

    expect(step.isFacingRight).toBe(true);
  });

  it('should pass the vertical velocity on unchanged when the move is made', () => {
    const step = createPlayerStepHorizontalMove(FALL, OPEN_MOVE);

    expect(step.velocityY).toBe(75);
  });

  it('should pass the grounded status on unchanged when the move is made', () => {
    const step = createPlayerStepHorizontalMove(FALL, OPEN_MOVE);

    expect(step.isGrounded).toBe(true);
  });
});
