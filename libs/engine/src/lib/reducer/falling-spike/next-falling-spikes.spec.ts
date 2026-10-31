import {
  type FallingSpike,
  type Player,
  PRONG_HEIGHT,
  TERMINAL_VELOCITY,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { BASE_HEARTS } from '../player/consts';
import { createPlayer } from '../player/create-player';
import { nextFallingSpike } from './next-falling-spike';
import { nextFallingSpikes } from './next-falling-spikes';

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
  '..........',
  '..........',
  '..........',
  '..........',
  '..........',
  '##########',
]);

const FLOOR_TOP = 160;

const DELTA_SECONDS = 1 / 60;

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const PLAYER: Player = { ...BASE_PLAYER, position: { x: 250, y: 100 } };

const createSpike = (
  left: number,
  top: number,
  isFalling: boolean,
): FallingSpike => ({
  position: { x: left, y: top },
  velocity: { y: { current: 0, max: TERMINAL_VELOCITY } },
  statuses: { isFalling },
});

const createSpikes = (): FallingSpike[] => [
  createSpike(32, 0, true),
  createSpike(224, FLOOR_TOP - PRONG_HEIGHT, true),
];

describe('nextFallingSpikes', () => {
  it('should move every falling spike on by one step and drop the one that lands when they fall', () => {
    const spikes = createSpikes();

    const advanced = nextFallingSpikes(LEVEL, spikes, PLAYER, DELTA_SECONDS);

    expect(advanced).toEqual([
      nextFallingSpike(LEVEL, createSpike(32, 0, true), PLAYER, DELTA_SECONDS),
    ]);
  });

  it('should drop the spike when it lands on the floor', () => {
    const spikes = [createSpike(224, FLOOR_TOP - PRONG_HEIGHT, true)];

    const advanced = nextFallingSpikes(LEVEL, spikes, PLAYER, DELTA_SECONDS);

    expect(advanced).toEqual([]);
  });

  it('should keep the same resting spike when the player is far from it', () => {
    const spike = createSpike(32, 0, false);

    const advanced = nextFallingSpikes(LEVEL, [spike], PLAYER, DELTA_SECONDS);

    expect(size(advanced)).toBe(1);
    expect(head(advanced)).toBe(spike);
  });

  it('should give no spikes when the level has none', () => {
    const advanced = nextFallingSpikes(LEVEL, [], PLAYER, DELTA_SECONDS);

    expect(advanced).toEqual([]);
  });

  it('should leave the spikes it was given unchanged when they fall', () => {
    const spikes = createSpikes();

    nextFallingSpikes(LEVEL, spikes, PLAYER, DELTA_SECONDS);

    expect(spikes).toEqual(createSpikes());
  });
});
