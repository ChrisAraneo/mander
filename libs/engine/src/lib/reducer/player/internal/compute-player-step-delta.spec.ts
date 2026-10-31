import {
  type Level,
  MAX_TICK_SECONDS,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { InputState } from '../../../types/input-state';
import { createBasePlayerVelocity } from '../create-base-player-velocity';
import { computePlayerStepDelta } from './compute-player-step-delta';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['....', '....', '####'];

const createLevel = (): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const createStandingPlayer = (): Player => ({
  position: { x: 32, y: 16 },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0, cold: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const LEVEL = createLevel();

const PLAYER = createStandingPlayer();

const INPUT: InputState = { isLeft: false, isRight: true, isJump: false };

describe('computePlayerStepDelta', () => {
  it('should use the elapsed time as it is when the tick is shorter than the longest allowed tick', () => {
    const step = computePlayerStepDelta({
      level: LEVEL,
      player: PLAYER,
      input: INPUT,
      elapsedSeconds: 0.02,
    });

    expect(step.deltaSeconds).toBe(0.02);
  });

  it('should cut the elapsed time down to the longest allowed tick when the tick is longer', () => {
    const step = computePlayerStepDelta({
      level: LEVEL,
      player: PLAYER,
      input: INPUT,
      elapsedSeconds: 0.5,
    });

    expect(step.deltaSeconds).toBe(MAX_TICK_SECONDS);
  });

  it('should pass the level on unchanged when it measures the tick', () => {
    const step = computePlayerStepDelta({
      level: LEVEL,
      player: PLAYER,
      input: INPUT,
      elapsedSeconds: 0.02,
    });

    expect(step.level).toBe(LEVEL);
  });

  it('should pass the player on unchanged when it measures the tick', () => {
    const step = computePlayerStepDelta({
      level: LEVEL,
      player: PLAYER,
      input: INPUT,
      elapsedSeconds: 0.02,
    });

    expect(step.player).toBe(PLAYER);
  });

  it('should pass the input on unchanged when it measures the tick', () => {
    const step = computePlayerStepDelta({
      level: LEVEL,
      player: PLAYER,
      input: INPUT,
      elapsedSeconds: 0.02,
    });

    expect(step.input).toBe(INPUT);
  });
});
