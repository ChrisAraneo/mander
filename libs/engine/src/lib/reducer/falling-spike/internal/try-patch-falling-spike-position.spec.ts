import {
  type FallingSpike,
  GRAVITY,
  PRONG_HEIGHT,
  TERMINAL_VELOCITY,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { tryPatchFallingSpikePosition } from './try-patch-falling-spike-position';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel([
  '.....',
  '.....',
  '.....',
  '.....',
  '.....',
  '#####',
]);

const LEVEL_WITHOUT_FLOOR = createLevel([
  '.....',
  '.....',
  '.....',
  '.....',
  '.....',
  '.....',
]);

const FLOOR_TOP = 160;

const PIT_BOTTOM = 256;

const DELTA_SECONDS = 1 / 60;

const createSpike = (top: number, speed: number): FallingSpike => ({
  position: { x: 64, y: top },
  velocity: { y: { current: speed, max: TERMINAL_VELOCITY } },
  statuses: { isFalling: false },
});

describe('tryPatchFallingSpikePosition', () => {
  it('should speed the spike up by gravity when it falls through open air', () => {
    const spike = createSpike(0, 0);

    const patched = tryPatchFallingSpikePosition(LEVEL, spike, DELTA_SECONDS);

    expect(patched?.velocity.y.current).toBeCloseTo(GRAVITY * DELTA_SECONDS, 6);
    expect(patched?.velocity.y.max).toBe(TERMINAL_VELOCITY);
  });

  it('should move the spike down by its new speed when it falls through open air', () => {
    const spike = createSpike(0, 0);

    const patched = tryPatchFallingSpikePosition(LEVEL, spike, DELTA_SECONDS);

    expect(patched?.position.x).toBe(64);
    expect(patched?.position.y).toBeCloseTo(
      GRAVITY * DELTA_SECONDS * DELTA_SECONDS,
      6,
    );
  });

  it('should mark the spike as falling when it moves', () => {
    const spike = createSpike(0, 0);

    const patched = tryPatchFallingSpikePosition(LEVEL, spike, DELTA_SECONDS);

    expect(patched?.statuses.isFalling).toBe(true);
  });

  it('should hold the spike at its top speed when gravity would push it faster', () => {
    const spike = createSpike(0, TERMINAL_VELOCITY - 10);

    const patched = tryPatchFallingSpikePosition(LEVEL, spike, DELTA_SECONDS);

    expect(patched?.velocity.y.current).toBe(TERMINAL_VELOCITY);
    expect(patched?.position.y).toBeCloseTo(
      TERMINAL_VELOCITY * DELTA_SECONDS,
      6,
    );
  });

  it('should give nothing when the fall is blocked by the floor', () => {
    const spike = createSpike(FLOOR_TOP - PRONG_HEIGHT, 0);

    const patched = tryPatchFallingSpikePosition(LEVEL, spike, DELTA_SECONDS);

    expect(patched).toBeNull();
  });

  it('should give nothing when the spike falls out of the level', () => {
    const spike = createSpike(PIT_BOTTOM, 0);

    const patched = tryPatchFallingSpikePosition(
      LEVEL_WITHOUT_FLOOR,
      spike,
      DELTA_SECONDS,
    );

    expect(patched).toBeNull();
  });

  it('should leave the spike it was given unchanged when it moves', () => {
    const spike = createSpike(0, 0);

    tryPatchFallingSpikePosition(LEVEL, spike, DELTA_SECONDS);

    expect(spike).toEqual(createSpike(0, 0));
  });
});
