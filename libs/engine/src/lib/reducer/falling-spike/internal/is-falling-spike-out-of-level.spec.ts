import {
  type FallingSpike,
  TERMINAL_VELOCITY,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { isFallingSpikeOutOfLevel } from './is-falling-spike-out-of-level';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.....', '#####']);

const PIT_BOTTOM = 160;

const createSpike = (top: number): FallingSpike => ({
  position: { x: 64, y: top },
  velocity: { y: { current: 0, max: TERMINAL_VELOCITY } },
  statuses: { isFalling: true },
});

describe('isFallingSpikeOutOfLevel', () => {
  it('should say yes when the spike has fallen past the pit below the level', () => {
    const isOut = isFallingSpikeOutOfLevel(
      LEVEL,
      createSpike(PIT_BOTTOM + 0.5),
    );

    expect(isOut).toBe(true);
  });

  it('should say no when the spike is exactly at the bottom of the pit below the level', () => {
    const isOut = isFallingSpikeOutOfLevel(LEVEL, createSpike(PIT_BOTTOM));

    expect(isOut).toBe(false);
  });

  it('should say no when the spike is inside the level', () => {
    const isOut = isFallingSpikeOutOfLevel(LEVEL, createSpike(32));

    expect(isOut).toBe(false);
  });
});
