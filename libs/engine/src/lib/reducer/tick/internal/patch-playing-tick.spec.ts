import {
  MOON_MAGNET,
  type Tile,
  TILE_AIR,
  TILE_CANNON,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_FIREBALL,
  TILE_GEM,
  TILE_SPAWN,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { chain } from '@mander/utils';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { handleTick } from '../handle-tick';
import { patchPlayingTick } from './patch-playing-tick';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  c: TILE_CANNON,
  e: TILE_ENEMY,
  f: TILE_FIREBALL,
  g: TILE_GEM,
  s: TILE_SPAWN,
  v: TILE_SPIKE_FALLING,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const BUSY_LEVEL = createLevel([
  '..c.......',
  '...v..f...',
  'sg..e...g.',
  '##########',
]);

const OPEN_LEVEL = createLevel([
  '..........',
  '..........',
  '..........',
  '..........',
  's.........',
  '##########',
]);

const DELTA_SECONDS = 0.02;

const createBusyState = (): GameState => ({
  ...createInitialState(BUSY_LEVEL, 0, [MOON_MAGNET]),
  input: { isLeft: false, isRight: true, isJump: false },
});

const createFloatingState = (): GameState =>
  chain(createInitialState(OPEN_LEVEL, 0, []))
    .thru((state): GameState => ({
      ...state,
      player: { ...state.player, position: { x: 100, y: 20 } },
    }))
    .value();

describe('patchPlayingTick', () => {
  it('should give the same game as a tick of a game being played when the same time passes', () => {
    const state = createBusyState();

    const ticked = patchPlayingTick(state, DELTA_SECONDS);

    expect(ticked).toEqual(handleTick(state, DELTA_SECONDS));
  });

  it('should let the player fall under gravity and advance the time when the player is in open air', () => {
    const state = createFloatingState();

    const ticked = patchPlayingTick(state, DELTA_SECONDS);

    expect(state.player.velocity.y.current).toBe(0);
    expect(ticked.player.velocity.y.current).toBeCloseTo(36, 6);
    expect(ticked.player.position.y).toBeCloseTo(20.72, 6);
    expect(ticked.time).toBeCloseTo(0.02, 6);
  });

  it('should leave the given game unchanged when a tick passes', () => {
    const state = createBusyState();

    patchPlayingTick(state, DELTA_SECONDS);

    expect(state).toEqual(createBusyState());
  });
});
