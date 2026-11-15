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
  freezingEnemyChance: 0,
});

const SPIKE_LEFT = 160;
const SPIKE_TOP = 32;
const PLAYER_TOP = 200;
const LEFT_OF_SPIKE_LEFT = 100;
const RIGHT_OF_SPIKE_LEFT = 200;
const UNDER_SPIKE_CENTRE_LEFT = 165;
const GAP_TO_THE_LEFT = -65;
const GAP_TO_THE_RIGHT = 35;
const NO_GAP = 0;

const LEVEL = createLevel(['..........', '..........', '##########']);

const SPIKE: FallingSpike = {
  position: { x: SPIKE_LEFT, y: SPIKE_TOP },
  velocity: { y: { current: 0, max: TERMINAL_VELOCITY } },
  statuses: { isFalling: false },
};

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: PLAYER_TOP },
});

describe('computeFallingSpikeGap', () => {
  it('should give a negative distance when the centre of the player is left of the centre of the spike', () => {
    const player = createPlayerAt(LEFT_OF_SPIKE_LEFT);

    const gap = computeFallingSpikeGap(SPIKE, player);

    expect(gap).toBe(GAP_TO_THE_LEFT);
  });

  it('should give a positive distance when the centre of the player is right of the centre of the spike', () => {
    const player = createPlayerAt(RIGHT_OF_SPIKE_LEFT);

    const gap = computeFallingSpikeGap(SPIKE, player);

    expect(gap).toBe(GAP_TO_THE_RIGHT);
  });

  it('should give nothing when the player stands right under the centre of the spike', () => {
    const player = createPlayerAt(UNDER_SPIKE_CENTRE_LEFT);

    const gap = computeFallingSpikeGap(SPIKE, player);

    expect(gap).toBe(NO_GAP);
  });
});
