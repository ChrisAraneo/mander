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

import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import type { GameLevel } from '../../state/types/game-level';
import { computeFallingSpikeDepth } from './compute-falling-spike-depth';

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

const SPIKE_LEFT = 160;
const SPIKE_TOP = 32;
const PLAYER_LEFT = 100;
const BELOW_SPIKE_TOP = 200;
const ABOVE_SPIKE_TOP = 0;
const LEVEL_WITH_SPIKE_CENTRE_TOP = 24;
const DEPTH_BELOW = 176;
const DEPTH_ABOVE = -24;
const NO_DEPTH = 0;

const LEVEL = createLevel(['..........', '..........', '##########']);

const SPIKE: FallingSpike = {
  position: { x: SPIKE_LEFT, y: SPIKE_TOP },
  velocity: { y: { current: 0, max: TERMINAL_VELOCITY } },
  statuses: { isFalling: false },
};

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (top: number): Player => ({
  ...BASE_PLAYER,
  position: { x: PLAYER_LEFT, y: top },
});

describe('computeFallingSpikeDepth', () => {
  it('should measure how far the centre of the player is below the centre of the spike when the player stands beneath it', () => {
    const player = createPlayerAt(BELOW_SPIKE_TOP);

    const depth = computeFallingSpikeDepth(SPIKE, player);

    expect(depth).toBe(DEPTH_BELOW);
  });

  it('should give a negative distance when the player is above the spike', () => {
    const player = createPlayerAt(ABOVE_SPIKE_TOP);

    const depth = computeFallingSpikeDepth(SPIKE, player);

    expect(depth).toBe(DEPTH_ABOVE);
  });

  it('should give nothing when the centre of the player is level with the centre of the spike', () => {
    const player = createPlayerAt(LEVEL_WITH_SPIKE_CENTRE_TOP);

    const depth = computeFallingSpikeDepth(SPIKE, player);

    expect(depth).toBe(NO_DEPTH);
  });
});
