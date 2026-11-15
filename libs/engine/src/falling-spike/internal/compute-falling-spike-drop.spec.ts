import {
  type FallingSpike,
  TERMINAL_VELOCITY,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import { computeFallingSpikeDrop } from './compute-falling-spike-drop';

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

const BEFORE_FLOOR_TOP = 150;

const SLOW_FALL_SPEED = 100;

const DELTA_SECONDS = 1 / 60;

const PRECISION = 6;

const createSpike = (top: number, speed: number): FallingSpike => ({
  position: { x: SPIKE_LEFT, y: top },
  velocity: { y: { current: speed, max: TERMINAL_VELOCITY } },
  statuses: { isFalling: false },
});

const LONG_TICK_SECONDS = 1;

describe('computeFallingSpikeDrop', () => {
  it('should move the spike down the whole way when it falls through open air', () => {
    const step = computeFallingSpikeDrop({
      level: LEVEL,
      spike: createSpike(CEILING_TOP, SLOW_FALL_SPEED),
      deltaSeconds: DELTA_SECONDS,
      velocityY: SLOW_FALL_SPEED,
    });

    expect(step.vertical.position).toBeCloseTo(
      CEILING_TOP + SLOW_FALL_SPEED * DELTA_SECONDS,
      PRECISION,
    );
    expect(step.vertical.isBlocked).toBe(false);
  });

  it('should stop the spike against the floor when a solid tile is on the way', () => {
    const step = computeFallingSpikeDrop({
      level: LEVEL,
      spike: createSpike(BEFORE_FLOOR_TOP, SLOW_FALL_SPEED),
      deltaSeconds: LONG_TICK_SECONDS,
      velocityY: SLOW_FALL_SPEED,
    });

    expect(step.vertical.isBlocked).toBe(true);
  });

  it('should pass the fall speed on unchanged when it moves the spike down', () => {
    const step = computeFallingSpikeDrop({
      level: LEVEL,
      spike: createSpike(CEILING_TOP, SLOW_FALL_SPEED),
      deltaSeconds: DELTA_SECONDS,
      velocityY: SLOW_FALL_SPEED,
    });

    expect(step.velocityY).toBe(SLOW_FALL_SPEED);
  });

  it('should pass the spike on unchanged when it moves the spike down', () => {
    const spike = createSpike(CEILING_TOP, SLOW_FALL_SPEED);

    const step = computeFallingSpikeDrop({
      level: LEVEL,
      spike,
      deltaSeconds: DELTA_SECONDS,
      velocityY: SLOW_FALL_SPEED,
    });

    expect(step.spike).toBe(spike);
  });
});
