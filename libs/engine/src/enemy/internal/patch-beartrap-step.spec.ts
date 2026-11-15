import {
  type Enemy,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { ENEMY_DEATH_SECONDS } from '../consts';
import { ENEMY_PIT_DEPTH_TILES } from './consts';
import { patchBeartrapStep } from './patch-beartrap-step';
import type { BeartrapStepVerticalMove } from './types/beartrap-step-vertical-move';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['......', '......', '......', '######'];

const createLevel = (): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const createFallingTrap = (): Enemy => ({
  kind: 'BEARTRAP',
  position: { x: 36, y: 70 },
  velocity: { x: { current: 5, max: 0 }, y: { current: 50, max: 430 } },
  timers: { death: null, reload: 0 },
  spawn: { x: 36, y: 74 },
  statuses: { isFacingRight: true, isGrounded: false },
});

const LEVEL = createLevel();

const PIT_BOTTOM = (size(ROWS) + ENEMY_PIT_DEPTH_TILES) * TILE_SIZE;

const createVerticalMoveStep = (
  trap: Enemy,
  nextY: number,
): BeartrapStepVerticalMove => ({
  level: LEVEL,
  trap,
  velocityY: 0,
  isGrounded: true,
  nextY,
});

const TRAP = createFallingTrap();

const STEP = createVerticalMoveStep(TRAP, 74);

describe('patchBeartrapStep', () => {
  it('should place the trap at the next height with its new speeds and footing when it is above the pit', () => {
    const patched = patchBeartrapStep(STEP);

    expect(patched.position).toEqual({ x: 36, y: 74 });
    expect(patched.velocity).toEqual({
      x: { current: 0, max: 0 },
      y: { current: 0, max: 430 },
    });
    expect(patched.statuses).toEqual({
      isFacingRight: true,
      isGrounded: true,
    });
  });

  it('should start the death of the trap and stop it when it has fallen below the bottom of the pit', () => {
    const patched = patchBeartrapStep(
      createVerticalMoveStep(TRAP, PIT_BOTTOM + 1),
    );

    expect(PIT_BOTTOM).toBe(192);
    expect(patched.timers.death).toBe(ENEMY_DEATH_SECONDS);
    expect(patched.velocity.x.current).toBe(0);
    expect(patched.velocity.y.current).toBe(0);
    expect(patched.position).toEqual({ x: 36, y: 70 });
  });

  it('should leave the given trap unchanged when it finishes the step', () => {
    const trap = createFallingTrap();

    patchBeartrapStep(createVerticalMoveStep(trap, 74));

    expect(trap).toEqual(createFallingTrap());
  });
});
