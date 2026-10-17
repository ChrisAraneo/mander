import {
  type Enemy,
  type Level,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createBasePlayerVelocity } from '../../player/create-base-player-velocity';
import { computeBeartrapStepHop } from './compute-beartrap-step-hop';
import type { BeartrapStepDelta } from './types/beartrap-step-delta';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['......', '......', '......', '######'];

const createLevel = (): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const createRestingTrap = (): Enemy => ({
  kind: 'BEARTRAP',
  position: { x: 80, y: 74 },
  velocity: { x: { current: 0, max: 0 }, y: { current: 12, max: 430 } },
  timers: { death: null },
  spawn: { x: 80, y: 74 },
  statuses: { isFacingRight: true, isGrounded: true },
});

const createPlayerAt = (left: number, top: number): Player => ({
  position: { x: left, y: top },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const LEVEL = createLevel();

const TRAP = createRestingTrap();

const NEARBY_PLAYER = createPlayerAt(80, 50);

const DISTANT_PLAYER = createPlayerAt(300, 50);

const createDeltaStep = (player: Player): BeartrapStepDelta => ({
  level: LEVEL,
  trap: TRAP,
  player,
  deltaSeconds: 0.02,
});

const DISTANT_STEP = createDeltaStep(DISTANT_PLAYER);

describe('computeBeartrapStepHop', () => {
  it('should make the trap jump off the ground when it rests on the ground and the player is near', () => {
    const step = computeBeartrapStepHop(createDeltaStep(NEARBY_PLAYER));

    expect(step.velocityY).toBe(-430);
    expect(step.isGrounded).toBe(false);
  });

  it('should keep the trap speed and footing when the player is not near', () => {
    const step = computeBeartrapStepHop(DISTANT_STEP);

    expect(step.velocityY).toBe(12);
    expect(step.isGrounded).toBe(true);
  });

  it('should pass the level on unchanged when it decides on the hop', () => {
    const step = computeBeartrapStepHop(DISTANT_STEP);

    expect(step.level).toBe(LEVEL);
  });

  it('should pass the trap on unchanged when it decides on the hop', () => {
    const step = computeBeartrapStepHop(DISTANT_STEP);

    expect(step.trap).toBe(TRAP);
  });

  it('should pass the tick length on unchanged when it decides on the hop', () => {
    const step = computeBeartrapStepHop(DISTANT_STEP);

    expect(step.deltaSeconds).toBe(0.02);
  });
});
