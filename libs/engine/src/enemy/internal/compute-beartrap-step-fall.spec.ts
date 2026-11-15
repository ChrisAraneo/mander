import {
  type Enemy,
  GRAVITY,
  type Level,
  TERMINAL_VELOCITY,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeBeartrapStepFall } from './compute-beartrap-step-fall';
import type { BeartrapStepIntent } from './types/beartrap-step-intent';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['....', '....', '####'];

const createLevel = (): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const createFallingTrap = (): Enemy => ({
  kind: 'BEARTRAP',
  position: { x: 40, y: 10 },
  velocity: { x: { current: 0, max: 0 }, y: { current: 100, max: 430 } },
  timers: { death: null, reload: 0 },
  spawn: { x: 40, y: 10 },
  statuses: { isFacingRight: true, isGrounded: false },
});

const SLOW_FALL_SPEED = 100;
const PAST_TERMINAL_FALL_SPEED = 1140;
const SPED_UP_FALL_SPEED = 136;
const TICK_SECONDS = 0.02;
const LONG_TICK_SECONDS = 0.04;
const PRECISION = 6;

const LEVEL = createLevel();

const TRAP = createFallingTrap();

const createIntentStep = (
  velocityY: number,
  deltaSeconds: number,
): BeartrapStepIntent => ({
  level: LEVEL,
  trap: TRAP,
  deltaSeconds,
  velocityY,
  isGrounded: false,
});

const SLOW_STEP = createIntentStep(SLOW_FALL_SPEED, TICK_SECONDS);

describe('computeBeartrapStepFall', () => {
  it('should speed the fall up by gravity over the tick when the trap falls slowly', () => {
    const step = computeBeartrapStepFall(SLOW_STEP);

    expect(step.velocityY).toBeCloseTo(
      SLOW_FALL_SPEED + GRAVITY * TICK_SECONDS,
      PRECISION,
    );
    expect(step.velocityY).toBeCloseTo(SPED_UP_FALL_SPEED, PRECISION);
  });

  it('should hold the fall at terminal velocity when gravity would push it past that speed', () => {
    const step = computeBeartrapStepFall(
      createIntentStep(PAST_TERMINAL_FALL_SPEED, LONG_TICK_SECONDS),
    );

    expect(step.velocityY).toBe(TERMINAL_VELOCITY);
  });

  it('should pass the level on unchanged when it applies gravity', () => {
    const step = computeBeartrapStepFall(SLOW_STEP);

    expect(step.level).toBe(LEVEL);
  });

  it('should pass the trap on unchanged when it applies gravity', () => {
    const step = computeBeartrapStepFall(SLOW_STEP);

    expect(step.trap).toBe(TRAP);
  });

  it('should pass the tick length on unchanged when it applies gravity', () => {
    const step = computeBeartrapStepFall(SLOW_STEP);

    expect(step.deltaSeconds).toBe(0.02);
  });

  it('should pass the grounded status on unchanged when it applies gravity', () => {
    const step = computeBeartrapStepFall(SLOW_STEP);

    expect(step.isGrounded).toBe(false);
  });
});
