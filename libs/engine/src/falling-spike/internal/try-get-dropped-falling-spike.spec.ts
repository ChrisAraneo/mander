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
import { tryGetDroppedFallingSpike } from './try-get-dropped-falling-spike';

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

const FLOOR_TOP = 160;

const BEFORE_FLOOR_TOP = 150;

const NO_FALL_SPEED = 0;

const SLOW_FALL_SPEED = 100;

const createSpike = (top: number, speed: number): FallingSpike => ({
  position: { x: SPIKE_LEFT, y: top },
  velocity: { y: { current: speed, max: TERMINAL_VELOCITY } },
  statuses: { isFalling: false },
});

const PIT_BOTTOM = 256;

describe('tryGetDroppedFallingSpike', () => {
  it('should give the dropped spike when the way down was open', () => {
    const dropped = tryGetDroppedFallingSpike({
      level: LEVEL,
      spike: createSpike(CEILING_TOP, NO_FALL_SPEED),
      velocityY: SLOW_FALL_SPEED,
      vertical: { position: BEFORE_FLOOR_TOP, isBlocked: false },
    });

    expect(dropped?.position.y).toBe(BEFORE_FLOOR_TOP);
    expect(dropped?.velocity.y.current).toBe(SLOW_FALL_SPEED);
  });

  it('should give nothing when the spike was stopped by a solid tile', () => {
    const dropped = tryGetDroppedFallingSpike({
      level: LEVEL,
      spike: createSpike(BEFORE_FLOOR_TOP, SLOW_FALL_SPEED),
      velocityY: SLOW_FALL_SPEED,
      vertical: { position: FLOOR_TOP, isBlocked: true },
    });

    expect(dropped).toBeUndefined();
  });

  it('should give nothing when the spike has dropped out of the level', () => {
    const dropped = tryGetDroppedFallingSpike({
      level: LEVEL,
      spike: createSpike(FLOOR_TOP, SLOW_FALL_SPEED),
      velocityY: SLOW_FALL_SPEED,
      vertical: { position: PIT_BOTTOM + 1, isBlocked: false },
    });

    expect(dropped).toBeUndefined();
  });

  it('should leave the given spike unchanged when it drops', () => {
    const spike = createSpike(CEILING_TOP, NO_FALL_SPEED);

    tryGetDroppedFallingSpike({
      level: LEVEL,
      spike,
      velocityY: SLOW_FALL_SPEED,
      vertical: { position: BEFORE_FLOOR_TOP, isBlocked: false },
    });

    expect(spike).toEqual(createSpike(CEILING_TOP, NO_FALL_SPEED));
  });
});
