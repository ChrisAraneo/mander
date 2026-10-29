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

const AIRBORNE_TRAP = createFallingTrap(10);

const LANDING_TRAP = createFallingTrap(72);

const createIntentStep = (
  trap: Enemy,
  velocityY: number,
  isGrounded: boolean,
): BeartrapStepIntent => ({
  level: LEVEL,
  trap,
  deltaSeconds: 0.04,
  velocityY,
  isGrounded,
});

const AIRBORNE_STEP = createIntentStep(AIRBORNE_TRAP, 100, true);

describe('computeBeartrapStepVerticalMove', () => {
  it('should move the trap down the whole way and leave it off the ground when it falls through open air', () => {
    const step = computeBeartrapStepVerticalMove(AIRBORNE_STEP);

    expect(step.nextY).toBeCloseTo(10 + 100 * 0.04, 6);
    expect(step.nextY).toBeCloseTo(14, 6);
    expect(step.velocityY).toBe(100);
    expect(step.isGrounded).toBe(false);
  });

  it('should put the trap on the floor and stop its fall when it falls onto a solid tile', () => {
    const step = computeBeartrapStepVerticalMove(
      createIntentStep(LANDING_TRAP, 300, false),
    );

    expect(step.nextY).toBe(74);
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
