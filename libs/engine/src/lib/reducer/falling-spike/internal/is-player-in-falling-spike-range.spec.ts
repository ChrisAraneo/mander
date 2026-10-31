import {
  type FallingSpike,
  type Player,
  TERMINAL_VELOCITY,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { BASE_HEARTS, PLAYER_HEIGHT, PLAYER_WIDTH } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import {
  FALLING_SPIKE_TRIGGER_DEPTH,
  FALLING_SPIKE_TRIGGER_RANGE,
} from '../consts';
import { isPlayerInFallingSpikeRange } from './is-player-in-falling-spike-range';

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

const LEVEL = createLevel(['..........', '..........', '##########']);

const SPIKE: FallingSpike = {
  position: { x: 160, y: 32 },
  velocity: { y: { current: 0, max: TERMINAL_VELOCITY } },
  statuses: { isFalling: false },
};

const SPIKE_CENTRE_X = 160 + TILE_SIZE / 2;

const SPIKE_CENTRE_Y = 32 + TILE_SIZE / 2;

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (gap: number, depth: number): Player => ({
  ...BASE_PLAYER,
  position: {
    x: SPIKE_CENTRE_X + gap - PLAYER_WIDTH / 2,
    y: SPIKE_CENTRE_Y + depth - PLAYER_HEIGHT / 2,
  },
});

describe('isPlayerInFallingSpikeRange', () => {
  it('should say yes when the player stands right under the spike', () => {
    const player = createPlayerAt(0, 100);

    const isInRange = isPlayerInFallingSpikeRange(SPIKE, player);

    expect(isInRange).toBe(true);
  });

  it('should say yes when the player is at the furthest reach of the spike to the right and below', () => {
    const player = createPlayerAt(
      FALLING_SPIKE_TRIGGER_RANGE,
      FALLING_SPIKE_TRIGGER_DEPTH,
    );

    const isInRange = isPlayerInFallingSpikeRange(SPIKE, player);

    expect(isInRange).toBe(true);
  });

  it('should say yes when the player is at the furthest reach of the spike to the left', () => {
    const player = createPlayerAt(-FALLING_SPIKE_TRIGGER_RANGE, 100);

    const isInRange = isPlayerInFallingSpikeRange(SPIKE, player);

    expect(isInRange).toBe(true);
  });

  it('should say no when the centre of the player is level with the centre of the spike', () => {
    const player = createPlayerAt(0, 0);

    const isInRange = isPlayerInFallingSpikeRange(SPIKE, player);

    expect(isInRange).toBe(false);
  });

  it('should say no when the player is above the spike', () => {
    const player = createPlayerAt(0, -1);

    const isInRange = isPlayerInFallingSpikeRange(SPIKE, player);

    expect(isInRange).toBe(false);
  });

  it('should say no when the player is too far below the spike', () => {
    const player = createPlayerAt(0, FALLING_SPIKE_TRIGGER_DEPTH + 1);

    const isInRange = isPlayerInFallingSpikeRange(SPIKE, player);

    expect(isInRange).toBe(false);
  });

  it('should say no when the player is too far to the right of the spike', () => {
    const player = createPlayerAt(FALLING_SPIKE_TRIGGER_RANGE + 1, 100);

    const isInRange = isPlayerInFallingSpikeRange(SPIKE, player);

    expect(isInRange).toBe(false);
  });

  it('should say no when the player is too far to the left of the spike', () => {
    const player = createPlayerAt(-FALLING_SPIKE_TRIGGER_RANGE - 1, 100);

    const isInRange = isPlayerInFallingSpikeRange(SPIKE, player);

    expect(isInRange).toBe(false);
  });
});
