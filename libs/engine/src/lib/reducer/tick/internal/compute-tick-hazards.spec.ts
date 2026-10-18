import {
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
import { computeTickHazards } from './compute-tick-hazards';
import { computeTickPlayer } from './compute-tick-player';
import { createRespawnedTickHazards } from './create-respawned-tick-hazards';
import { patchMovedTickHazards } from './patch-moved-tick-hazards';
import type { TickPlayer } from './types/tick-player';

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

const BASE_STATE = createInitialState(LEVEL, 0, []);

const createStateWithDeath = (death: number | null): GameState => ({
  ...BASE_STATE,
  input: { isLeft: false, isRight: true, isJump: false },
  player: {
    ...BASE_STATE.player,
    timers: { ...BASE_STATE.player.timers, death },
  },
});

const createTickPlayer = (death: number | null): TickPlayer =>
  computeTickPlayer({
    state: createStateWithDeath(death),
    deltaSeconds: DELTA_SECONDS,
  });

describe('computeTickHazards', () => {
  it('should give the hazards of a fresh level when the player has respawned', () => {
    const tick = createTickPlayer(0.74);

    const hazards = computeTickHazards(tick);

    expect(tick.hasRespawned).toBe(true);
    expect(hazards).toEqual({
      state: tick.state,
      deltaSeconds: DELTA_SECONDS,
      moved: tick.moved,
      isPlayerAlive: tick.isPlayerAlive,
      ...createRespawnedTickHazards(tick.state),
    });
  });

  it('should give the hazards moved for the tick when the player has not respawned', () => {
    const tick = createTickPlayer(null);

    const hazards = computeTickHazards(tick);

    expect(tick.hasRespawned).toBe(false);
    expect(hazards).toEqual({
      state: tick.state,
      deltaSeconds: DELTA_SECONDS,
      moved: tick.moved,
      isPlayerAlive: tick.isPlayerAlive,
      ...patchMovedTickHazards(tick.state, tick.moved, DELTA_SECONDS),
    });
  });

  it('should give no bullets when the player has respawned', () => {
    const tick = createTickPlayer(0.74);

    const hazards = computeTickHazards(tick);

    expect(hazards.flyingBullets).toEqual([]);
  });

  it('should pass the same game on when the hazards move', () => {
    const tick = createTickPlayer(null);

    const hazards = computeTickHazards(tick);

    expect(hazards.state).toBe(tick.state);
  });

  it('should pass the same elapsed time on when the hazards move', () => {
    const tick = createTickPlayer(null);

    const hazards = computeTickHazards(tick);

    expect(hazards.deltaSeconds).toBe(tick.deltaSeconds);
  });

  it('should pass the same moved player on when the hazards move', () => {
    const tick = createTickPlayer(null);

    const hazards = computeTickHazards(tick);

    expect(hazards.moved).toBe(tick.moved);
  });

  it('should pass on whether the player is alive when the hazards move', () => {
    const tick = createTickPlayer(0.1);

    const hazards = computeTickHazards(tick);

    expect(hazards.isPlayerAlive).toBe(tick.isPlayerAlive);
    expect(hazards.isPlayerAlive).toBe(false);
  });
});
