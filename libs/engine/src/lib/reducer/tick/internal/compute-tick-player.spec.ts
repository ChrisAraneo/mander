import {
  MOON_MAGNET,
  type Tile,
  TILE_AIR,
  TILE_CANNON,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_FIREBALL,
  TILE_SPAWN,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { isAlive } from '../../player/is-alive';
import { computeTickPlayer } from './compute-tick-player';
import { patchMovedPlayer } from './patch-moved-player';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  c: TILE_CANNON,
  e: TILE_ENEMY,
  f: TILE_FIREBALL,
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

const LEVEL = createLevel(['..c.....', '...v..f.', 's...e...', '########']);

const DELTA_SECONDS = 0.02;

const BASE_STATE = createInitialState(LEVEL, 0, [MOON_MAGNET]);

const createStateWithDeath = (death: number | null): GameState => ({
  ...BASE_STATE,
  input: { isLeft: false, isRight: true, isJump: false },
  player: {
    ...BASE_STATE.player,
    timers: { ...BASE_STATE.player.timers, death },
  },
});

describe('computeTickPlayer', () => {
  it('should give the player moved for the tick when the player is alive', () => {
    const state = createStateWithDeath(null);

    const tick = computeTickPlayer({ state, deltaSeconds: DELTA_SECONDS });

    expect(tick.moved).toEqual(patchMovedPlayer(state, DELTA_SECONDS));
  });

  it('should give the player moved for the tick when the player is dying', () => {
    const state = createStateWithDeath(0.1);

    const tick = computeTickPlayer({ state, deltaSeconds: DELTA_SECONDS });

    expect(tick.moved).toEqual(patchMovedPlayer(state, DELTA_SECONDS));
  });

  it('should say the player has respawned when the death of the player ends in this tick', () => {
    const state = createStateWithDeath(0.74);

    const tick = computeTickPlayer({ state, deltaSeconds: DELTA_SECONDS });

    expect(tick.hasRespawned).toBe(true);
  });

  it('should say the player has not respawned when the player is still dying', () => {
    const state = createStateWithDeath(0.1);

    const tick = computeTickPlayer({ state, deltaSeconds: DELTA_SECONDS });

    expect(tick.hasRespawned).toBe(false);
  });

  it('should say the player has not respawned when the player was alive', () => {
    const state = createStateWithDeath(null);

    const tick = computeTickPlayer({ state, deltaSeconds: DELTA_SECONDS });

    expect(tick.hasRespawned).toBe(false);
  });

  it('should say the player is alive when the moved player is alive', () => {
    const state = createStateWithDeath(null);

    const tick = computeTickPlayer({ state, deltaSeconds: DELTA_SECONDS });

    expect(tick.isPlayerAlive).toBe(isAlive(tick.moved));
    expect(tick.isPlayerAlive).toBe(true);
  });

  it('should say the player is not alive when the moved player is still dying', () => {
    const state = createStateWithDeath(0.1);

    const tick = computeTickPlayer({ state, deltaSeconds: DELTA_SECONDS });

    expect(tick.isPlayerAlive).toBe(isAlive(tick.moved));
    expect(tick.isPlayerAlive).toBe(false);
  });

  it('should pass the same game on when the game ticks', () => {
    const state = createStateWithDeath(null);

    const tick = computeTickPlayer({ state, deltaSeconds: DELTA_SECONDS });

    expect(tick.state).toBe(state);
  });

  it('should pass the same elapsed time on when the game ticks', () => {
    const state = createStateWithDeath(null);

    const tick = computeTickPlayer({ state, deltaSeconds: DELTA_SECONDS });

    expect(tick.deltaSeconds).toBe(DELTA_SECONDS);
  });
});
