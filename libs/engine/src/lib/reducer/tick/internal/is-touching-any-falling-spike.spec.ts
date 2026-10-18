import {
  type Player,
  PRONG_HEIGHT,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPAWN,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import { createFallingSpikes } from '../../falling-spike/create-falling-spikes';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../player/consts';
import { isTouchingAnyFallingSpike } from './is-touching-any-falling-spike';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  f: TILE_SPIKE_FALLING,
  s: TILE_SPAWN,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel([
  '##########',
  '..f.......',
  '..........',
  '..........',
  's.........',
  '##########',
]);

const STATE = createInitialState(LEVEL, 0, []);

const FALLING_SPIKES = createFallingSpikes(LEVEL);

const createPlayerAt = (left: number, top: number): Player => ({
  ...STATE.player,
  position: { x: left, y: top },
});

const UNDER_SPIKE_PLAYER = createPlayerAt(
  2 * TILE_SIZE + TILE_SIZE / 2 - PLAYER_WIDTH / 2,
  TILE_SIZE + PRONG_HEIGHT - PLAYER_HEIGHT / 2,
);

describe('isTouchingAnyFallingSpike', () => {
  it('should say yes when the player touches a falling spike', () => {
    const isTouching = isTouchingAnyFallingSpike(
      UNDER_SPIKE_PLAYER,
      FALLING_SPIKES,
    );

    expect(isTouching).toBe(true);
  });

  it('should say no when the player is clear of every falling spike', () => {
    const player = createPlayerAt(7 * TILE_SIZE, 3 * TILE_SIZE);

    const isTouching = isTouchingAnyFallingSpike(player, FALLING_SPIKES);

    expect(isTouching).toBe(false);
  });

  it('should say no when there are no falling spikes', () => {
    const isTouching = isTouchingAnyFallingSpike(UNDER_SPIKE_PLAYER, []);

    expect(isTouching).toBe(false);
  });
});
