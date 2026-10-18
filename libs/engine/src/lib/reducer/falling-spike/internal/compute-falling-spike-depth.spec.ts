import {
  type FallingSpike,
  type Player,
  TERMINAL_VELOCITY,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { computeFallingSpikeDepth } from './compute-falling-spike-depth';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel(['..........', '..........', '##########']);

const SPIKE: FallingSpike = {
  position: { x: 160, y: 32 },
  velocity: { y: { current: 0, max: TERMINAL_VELOCITY } },
  statuses: { isFalling: false },
};

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (top: number): Player => ({
  ...BASE_PLAYER,
  position: { x: 100, y: top },
});

describe('computeFallingSpikeDepth', () => {
  it('should measure how far the centre of the player is below the centre of the spike when the player stands beneath it', () => {
    const player = createPlayerAt(200);

    const depth = computeFallingSpikeDepth(SPIKE, player);

    expect(depth).toBe(176);
  });

  it('should give a negative distance when the player is above the spike', () => {
    const player = createPlayerAt(0);

    const depth = computeFallingSpikeDepth(SPIKE, player);

    expect(depth).toBe(-24);
  });

  it('should give nothing when the centre of the player is level with the centre of the spike', () => {
    const player = createPlayerAt(24);

    const depth = computeFallingSpikeDepth(SPIKE, player);

    expect(depth).toBe(0);
  });
});
