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
import { computeFallingSpikeGap } from './compute-falling-spike-gap';

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
});

const LEVEL = createLevel(['..........', '..........', '##########']);

const SPIKE: FallingSpike = {
  position: { x: 160, y: 32 },
  velocity: { y: { current: 0, max: TERMINAL_VELOCITY } },
  statuses: { isFalling: false },
};

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: 200 },
});

describe('computeFallingSpikeGap', () => {
  it('should give a negative distance when the centre of the player is left of the centre of the spike', () => {
    const player = createPlayerAt(100);

    const gap = computeFallingSpikeGap(SPIKE, player);

    expect(gap).toBe(-65);
  });

  it('should give a positive distance when the centre of the player is right of the centre of the spike', () => {
    const player = createPlayerAt(200);

    const gap = computeFallingSpikeGap(SPIKE, player);

    expect(gap).toBe(35);
  });

  it('should give nothing when the player stands right under the centre of the spike', () => {
    const player = createPlayerAt(165);

    const gap = computeFallingSpikeGap(SPIKE, player);

    expect(gap).toBe(0);
  });
});
