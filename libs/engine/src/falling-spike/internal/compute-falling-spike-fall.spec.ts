import {
  type FallingSpike,
  TERMINAL_VELOCITY,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { GRAVITY } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import { computeFallingSpikeFall } from './compute-falling-spike-fall';

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

const SPIKE_LEFT = 64;

const CEILING_TOP = 0;

const NO_FALL_SPEED = 0;

const SLOW_FALL_SPEED = 100;

const DELTA_SECONDS = 1 / 60;

const PRECISION = 6;

const createSpike = (top: number, speed: number): FallingSpike => ({
  position: { x: SPIKE_LEFT, y: top },
  velocity: { y: { current: speed, max: TERMINAL_VELOCITY } },
  statuses: { isFalling: false },
});

describe('computeFallingSpikeFall', () => {
  it('should speed the fall up by gravity over the tick when the spike falls slowly', () => {
    const step = computeFallingSpikeFall({
      level: LEVEL,
      spike: createSpike(CEILING_TOP, SLOW_FALL_SPEED),
      deltaSeconds: DELTA_SECONDS,
    });

    expect(step.velocityY).toBeCloseTo(
      SLOW_FALL_SPEED + GRAVITY * DELTA_SECONDS,
      PRECISION,
    );
  });

  it('should hold the fall at the top speed of the spike when gravity would push it past that speed', () => {
    const step = computeFallingSpikeFall({
      level: LEVEL,
      spike: createSpike(CEILING_TOP, TERMINAL_VELOCITY),
      deltaSeconds: DELTA_SECONDS,
    });

    expect(step.velocityY).toBe(TERMINAL_VELOCITY);
  });

  it('should pass the tick length on unchanged when it applies gravity', () => {
    const step = computeFallingSpikeFall({
      level: LEVEL,
      spike: createSpike(CEILING_TOP, NO_FALL_SPEED),
      deltaSeconds: DELTA_SECONDS,
    });

    expect(step.deltaSeconds).toBe(DELTA_SECONDS);
  });

  it('should leave the given spike unchanged when it applies gravity', () => {
    const spike = createSpike(CEILING_TOP, NO_FALL_SPEED);

    computeFallingSpikeFall({
      level: LEVEL,
      spike,
      deltaSeconds: DELTA_SECONDS,
    });

    expect(spike).toEqual(createSpike(CEILING_TOP, NO_FALL_SPEED));
  });
});
