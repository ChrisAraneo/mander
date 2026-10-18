import {
  type Level,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { InputState } from '../../../types/input-state';
import { PLAYER_MAX_JUMP_VELOCITY, PLAYER_MAX_MOVE_VELOCITY } from '../consts';
import { computePlayerStepIntent } from './compute-player-step-intent';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['....', '....', '####'];

const createLevel = (): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const createMovingPlayer = (
  isFacingRight: boolean,
  isGrounded: boolean,
  isJumpQueued: boolean,
): Player => ({
  position: { x: 32, y: 16 },
  velocity: {
    x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
    y: { current: 50, max: PLAYER_MAX_JUMP_VELOCITY },
  },
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
  statuses: { isFacingRight, isGrounded, isJumpQueued },
});

const createInput = (
  isLeft: boolean,
  isRight: boolean,
  isJump: boolean,
): InputState => ({ isLeft, isRight, isJump });

const LEVEL = createLevel();

const RIGHT_FACING_PLAYER = createMovingPlayer(true, true, false);

const LEFT_FACING_PLAYER = createMovingPlayer(false, true, false);

const QUEUED_PLAYER = createMovingPlayer(true, true, true);

const AIRBORNE_PLAYER = createMovingPlayer(true, false, false);

const NO_INPUT = createInput(false, false, false);

const RIGHT_INPUT = createInput(false, true, false);

const LEFT_INPUT = createInput(true, false, false);

const BOTH_INPUT = createInput(true, true, false);

const JUMP_INPUT = createInput(false, false, true);

describe('computePlayerStepIntent', () => {
  it('should run the player right at full speed and face them right when only the right key is held', () => {
    const step = computePlayerStepIntent({
      level: LEVEL,
      player: LEFT_FACING_PLAYER,
      input: RIGHT_INPUT,
      deltaSeconds: 0.02,
    });

    expect(step.velocityX).toBe(PLAYER_MAX_MOVE_VELOCITY);
    expect(step.isFacingRight).toBe(true);
  });

  it('should run the player left at full speed and face them left when only the left key is held', () => {
    const step = computePlayerStepIntent({
      level: LEVEL,
      player: RIGHT_FACING_PLAYER,
      input: LEFT_INPUT,
      deltaSeconds: 0.02,
    });

    expect(step.velocityX).toBe(-PLAYER_MAX_MOVE_VELOCITY);
    expect(step.isFacingRight).toBe(false);
  });

  it('should stop the player and keep their facing when no key is held', () => {
    const step = computePlayerStepIntent({
      level: LEVEL,
      player: LEFT_FACING_PLAYER,
      input: NO_INPUT,
      deltaSeconds: 0.02,
    });

    expect(step.velocityX).toBe(0);
    expect(step.isFacingRight).toBe(false);
  });

  it('should stop the player and keep their facing when both keys are held', () => {
    const step = computePlayerStepIntent({
      level: LEVEL,
      player: LEFT_FACING_PLAYER,
      input: BOTH_INPUT,
      deltaSeconds: 0.02,
    });

    expect(step.velocityX).toBe(0);
    expect(step.isFacingRight).toBe(false);
  });

  it('should launch the player upwards off the ground when they stand on the ground and hold jump', () => {
    const step = computePlayerStepIntent({
      level: LEVEL,
      player: RIGHT_FACING_PLAYER,
      input: JUMP_INPUT,
      deltaSeconds: 0.02,
    });

    expect(step.velocityY).toBe(-PLAYER_MAX_JUMP_VELOCITY);
    expect(step.isGrounded).toBe(false);
  });

  it('should launch the player upwards off the ground when they stand on the ground with a jump queued', () => {
    const step = computePlayerStepIntent({
      level: LEVEL,
      player: QUEUED_PLAYER,
      input: NO_INPUT,
      deltaSeconds: 0.02,
    });

    expect(step.velocityY).toBe(-PLAYER_MAX_JUMP_VELOCITY);
    expect(step.isGrounded).toBe(false);
  });

  it('should keep the player falling as they were when they are in the air and hold jump', () => {
    const step = computePlayerStepIntent({
      level: LEVEL,
      player: AIRBORNE_PLAYER,
      input: JUMP_INPUT,
      deltaSeconds: 0.02,
    });

    expect(step.velocityY).toBe(50);
    expect(step.isGrounded).toBe(false);
  });

  it('should pass the level on unchanged when it reads the input', () => {
    const step = computePlayerStepIntent({
      level: LEVEL,
      player: RIGHT_FACING_PLAYER,
      input: RIGHT_INPUT,
      deltaSeconds: 0.02,
    });

    expect(step.level).toBe(LEVEL);
  });

  it('should pass the player on unchanged when it reads the input', () => {
    const step = computePlayerStepIntent({
      level: LEVEL,
      player: RIGHT_FACING_PLAYER,
      input: RIGHT_INPUT,
      deltaSeconds: 0.02,
    });

    expect(step.player).toBe(RIGHT_FACING_PLAYER);
  });

  it('should pass the input on unchanged when it reads the input', () => {
    const step = computePlayerStepIntent({
      level: LEVEL,
      player: RIGHT_FACING_PLAYER,
      input: RIGHT_INPUT,
      deltaSeconds: 0.02,
    });

    expect(step.input).toBe(RIGHT_INPUT);
  });

  it('should pass the tick length on unchanged when it reads the input', () => {
    const step = computePlayerStepIntent({
      level: LEVEL,
      player: RIGHT_FACING_PLAYER,
      input: RIGHT_INPUT,
      deltaSeconds: 0.02,
    });

    expect(step.deltaSeconds).toBe(0.02);
  });
});
