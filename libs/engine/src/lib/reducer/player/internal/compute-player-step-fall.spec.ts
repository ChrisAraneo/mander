import {
  GRAVITY,
  type Level,
  type Player,
  TERMINAL_VELOCITY,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { InputState } from '../../../types/input-state';
import { createBasePlayerVelocity } from '../create-base-player-velocity';
import { computePlayerStepFall } from './compute-player-step-fall';
import type { PlayerStepIntent } from './types/player-step-intent';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['....', '....', '####'];

const createLevel = (): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const createAirbornePlayer = (): Player => ({
  position: { x: 32, y: 16 },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: false, isJumpQueued: false },
});

const LEVEL = createLevel();

const PLAYER = createAirbornePlayer();

const NO_INPUT: InputState = { isLeft: false, isRight: false, isJump: false };

const JUMP_INPUT: InputState = { isLeft: false, isRight: false, isJump: true };

const createIntentStep = (
  velocityY: number,
  input: InputState,
): PlayerStepIntent => ({
  level: LEVEL,
  player: PLAYER,
  input,
  deltaSeconds: 0.02,
  velocityX: 120,
  isFacingRight: false,
  velocityY,
  isGrounded: true,
});

const FALLING_STEP = createIntentStep(100, NO_INPUT);

describe('computePlayerStepFall', () => {
  it('should pull the player down by the full gravity when they are falling', () => {
    const step = computePlayerStepFall(FALLING_STEP);

    expect(step.velocityY).toBeCloseTo(100 + GRAVITY * 0.02, 6);
    expect(step.velocityY).toBeCloseTo(136, 6);
  });

  it('should pull the player down by the full gravity when they are rising and hold jump', () => {
    const step = computePlayerStepFall(createIntentStep(-300, JUMP_INPUT));

    expect(step.velocityY).toBeCloseTo(-300 + GRAVITY * 0.02, 6);
    expect(step.velocityY).toBeCloseTo(-264, 6);
  });

  it('should pull the player down by 2.6 times the gravity when they are rising and let go of jump', () => {
    const step = computePlayerStepFall(createIntentStep(-300, NO_INPUT));

    expect(step.velocityY).toBeCloseTo(-300 + GRAVITY * 2.6 * 0.02, 6);
    expect(step.velocityY).toBeCloseTo(-206.4, 6);
  });

  it('should hold the player at the terminal velocity when the pull would make them fall faster', () => {
    const step = computePlayerStepFall(createIntentStep(1140, NO_INPUT));

    expect(step.velocityY).toBe(TERMINAL_VELOCITY);
  });

  it('should pass the level on unchanged when it applies gravity', () => {
    const step = computePlayerStepFall(FALLING_STEP);

    expect(step.level).toBe(LEVEL);
  });

  it('should pass the player on unchanged when it applies gravity', () => {
    const step = computePlayerStepFall(FALLING_STEP);

    expect(step.player).toBe(PLAYER);
  });

  it('should pass the tick length on unchanged when it applies gravity', () => {
    const step = computePlayerStepFall(FALLING_STEP);

    expect(step.deltaSeconds).toBe(0.02);
  });

  it('should pass the horizontal velocity on unchanged when it applies gravity', () => {
    const step = computePlayerStepFall(FALLING_STEP);

    expect(step.velocityX).toBe(120);
  });

  it('should pass the facing on unchanged when it applies gravity', () => {
    const step = computePlayerStepFall(FALLING_STEP);

    expect(step.isFacingRight).toBe(false);
  });

  it('should pass the grounded status on unchanged when it applies gravity', () => {
    const step = computePlayerStepFall(FALLING_STEP);

    expect(step.isGrounded).toBe(true);
  });
});
