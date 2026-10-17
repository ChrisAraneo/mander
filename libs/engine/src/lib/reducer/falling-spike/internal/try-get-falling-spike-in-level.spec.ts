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
import { tryGetFallingSpikeInLevel } from './try-get-falling-spike-in-level';

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

describe('tryGetFallingSpikeInLevel', () => {
  it('should give back the same spike when it is inside the level', () => {
    const spike = createSpike(32);

    const kept = tryGetFallingSpikeInLevel(LEVEL, spike);

    expect(kept).toBe(spike);
  });

  it('should give back the same spike when it is exactly at the bottom of the pit below the level', () => {
    const spike = createSpike(PIT_BOTTOM);

    const kept = tryGetFallingSpikeInLevel(LEVEL, spike);

    expect(kept).toBe(spike);
  });

  it('should give nothing when the spike has fallen out of the level', () => {
    const spike = createSpike(PIT_BOTTOM + 0.5);

    const kept = tryGetFallingSpikeInLevel(LEVEL, spike);

    expect(kept).toBeNull();
  });
});
