import {
  type Enemy,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeBeartrapStepVerticalMove } from './compute-beartrap-step-vertical-move';
import type { BeartrapStepIntent } from './types/beartrap-step-intent';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['......', '......', '......', '######'];

const createLevel = (): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const createFallingTrap = (positionY: number): Enemy => ({
  kind: 'BEARTRAP',
  position: { x: 36, y: positionY },
  velocity: { x: { current: 0, max: 0 }, y: { current: 0, max: 430 } },
  timers: { death: null, reload: 0 },
  spawn: { x: 36, y: positionY },
  statuses: { isFacingRight: true, isGrounded: false },
});

const LEVEL = createLevel();

const AIRBORNE_TOP = 10;
const BEFORE_FLOOR_TOP = 72;
const FLOOR_TOP = 74;
const FALLEN_TOP = 14;
const TICK_SECONDS = 0.04;
const SLOW_FALL_SPEED = 100;
const FAST_FALL_SPEED = 300;
const PRECISION = 6;

const AIRBORNE_TRAP = createFallingTrap(AIRBORNE_TOP);

const LANDING_TRAP = createFallingTrap(BEFORE_FLOOR_TOP);

const createIntentStep = (
  trap: Enemy,
  velocityY: number,
  isGrounded: boolean,
): BeartrapStepIntent => ({
  level: LEVEL,
  trap,
  deltaSeconds: TICK_SECONDS,
  velocityY,
  isGrounded,
});

const AIRBORNE_STEP = createIntentStep(AIRBORNE_TRAP, SLOW_FALL_SPEED, true);

describe('computeBeartrapStepVerticalMove', () => {
  it('should move the trap down the whole way and leave it off the ground when it falls through open air', () => {
    const step = computeBeartrapStepVerticalMove(AIRBORNE_STEP);

    expect(step.nextY).toBeCloseTo(
      AIRBORNE_TOP + SLOW_FALL_SPEED * TICK_SECONDS,
      PRECISION,
    );
    expect(step.nextY).toBeCloseTo(FALLEN_TOP, PRECISION);
    expect(step.velocityY).toBe(SLOW_FALL_SPEED);
    expect(step.isGrounded).toBe(false);
  });

  it('should put the trap on the floor and stop its fall when it falls onto a solid tile', () => {
    const step = computeBeartrapStepVerticalMove(
      createIntentStep(LANDING_TRAP, FAST_FALL_SPEED, false),
    );

    expect(step.nextY).toBe(FLOOR_TOP);
    expect(step.velocityY).toBe(0);
    expect(step.isGrounded).toBe(true);
  });

  it('should pass the level on unchanged when it moves the trap up or down', () => {
    const step = computeBeartrapStepVerticalMove(AIRBORNE_STEP);

    expect(step.level).toBe(LEVEL);
  });

  it('should pass the trap on unchanged when it moves the trap up or down', () => {
    const step = computeBeartrapStepVerticalMove(AIRBORNE_STEP);

    expect(step.trap).toBe(AIRBORNE_TRAP);
  });
});
