import {
  type FallingSpike,
  type Level,
  type Player,
  TERMINAL_VELOCITY,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BASE_HEARTS, PLAYER_HEIGHT, PLAYER_WIDTH } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { FALLING_SPIKE_TRIGGER_RANGE } from '../consts';
import { isFallingSpikePathBlocked } from './is-falling-spike-path-blocked';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const createLevel = (rows: string[]): Level => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const OPEN_LEVEL = createLevel([
  '##########',
  '..........',
  '..........',
  '..........',
  '..........',
  '..........',
  '..........',
  '..........',
  '##########',
]);

const SHIELDED_LEVEL = createLevel([
  '##########',
  '..........',
  '..........',
  '..........',
  '.....#....',
  '..........',
  '..........',
  '..........',
  '##########',
]);

const SPIKE: FallingSpike = {
  position: { x: 5 * TILE_SIZE, y: TILE_SIZE },
  velocity: { y: { current: 0, max: TERMINAL_VELOCITY } },
  statuses: { isFalling: false },
};

const SPIKE_CENTRE_X = 5 * TILE_SIZE + TILE_SIZE / 2;

const STANDING_TOP = 8 * TILE_SIZE - PLAYER_HEIGHT;

const BASE_PLAYER = createPlayer(OPEN_LEVEL, {
  hearts: { value: BASE_HEARTS },
});

const createPlayerAt = (gap: number, top: number): Player => ({
  ...BASE_PLAYER,
  position: { x: SPIKE_CENTRE_X + gap - PLAYER_WIDTH / 2, y: top },
});

describe('isFallingSpikePathBlocked', () => {
  it('should return false when nothing solid lies between the spike and the player below it', () => {
    const player = createPlayerAt(0, STANDING_TOP);

    const isBlocked = isFallingSpikePathBlocked(OPEN_LEVEL, SPIKE, player);

    expect(isBlocked).toBe(false);
  });

  it('should return true when a solid block lies between the spike and the player below it', () => {
    const player = createPlayerAt(0, STANDING_TOP);

    const isBlocked = isFallingSpikePathBlocked(SHIELDED_LEVEL, SPIKE, player);

    expect(isBlocked).toBe(true);
  });

  it('should return true when a solid block lies right under the spike', () => {
    const level = createLevel([
      '##########',
      '..........',
      '.....#....',
      '..........',
      '..........',
      '..........',
      '..........',
      '..........',
      '##########',
    ]);
    const player = createPlayerAt(0, STANDING_TOP);

    const isBlocked = isFallingSpikePathBlocked(level, SPIKE, player);

    expect(isBlocked).toBe(true);
  });

  it('should return true when a solid block lies under the spike and the player stands to the side', () => {
    const player = createPlayerAt(FALLING_SPIKE_TRIGGER_RANGE, STANDING_TOP);

    const isBlocked = isFallingSpikePathBlocked(SHIELDED_LEVEL, SPIKE, player);

    expect(isBlocked).toBe(true);
  });

  it('should return false when the only solid block is outside the column of the spike', () => {
    const level = createLevel([
      '##########',
      '..........',
      '..........',
      '..........',
      '......#...',
      '..........',
      '..........',
      '..........',
      '##########',
    ]);
    const player = createPlayerAt(FALLING_SPIKE_TRIGGER_RANGE, STANDING_TOP);

    const isBlocked = isFallingSpikePathBlocked(level, SPIKE, player);

    expect(isBlocked).toBe(false);
  });

  it('should return false when the solid block under the spike is lower than the top of the player', () => {
    const level = createLevel([
      '##########',
      '..........',
      '..........',
      '..........',
      '..........',
      '..........',
      '..........',
      '.....#....',
      '##########',
    ]);
    const player = createPlayerAt(FALLING_SPIKE_TRIGGER_RANGE, STANDING_TOP);

    const isBlocked = isFallingSpikePathBlocked(level, SPIKE, player);

    expect(isBlocked).toBe(false);
  });

  it('should return false when the player is above the spike', () => {
    const player = createPlayerAt(0, 0);

    const isBlocked = isFallingSpikePathBlocked(OPEN_LEVEL, SPIKE, player);

    expect(isBlocked).toBe(false);
  });
});
