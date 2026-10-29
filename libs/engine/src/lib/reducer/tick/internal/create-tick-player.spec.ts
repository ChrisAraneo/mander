import {
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { createTickPlayer } from './create-tick-player';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  s: TILE_SPAWN,
};

const ROWS = ['.....', 's....', '#####'];

const LEVEL: GameLevel = {
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
};

const BASE_STATE = createInitialState(LEVEL, 0, []);

const DELTA_SECONDS = 0.02;

const createPlayerWithDeath = (death: number | null): Player => ({
  ...BASE_STATE.player,
  timers: { ...BASE_STATE.player.timers, death },
});

const createStateWithDeath = (death: number | null): GameState => ({
  ...BASE_STATE,
  player: createPlayerWithDeath(death),
});

describe('createTickPlayer', () => {
  it('should say the player has respawned when the player was dying and the moved player is alive', () => {
    const tick = createTickPlayer(
      createStateWithDeath(0.74),
      DELTA_SECONDS,
      createPlayerWithDeath(null),
    );

    expect(tick.hasRespawned).toBe(true);
  });

  it('should say the player has not respawned when the player is still dying', () => {
    const tick = createTickPlayer(
      createStateWithDeath(0.1),
      DELTA_SECONDS,
      createPlayerWithDeath(0.12),
    );

    expect(tick.hasRespawned).toBe(false);
  });

  it('should say the player has not respawned when the player was alive', () => {
    const tick = createTickPlayer(
      createStateWithDeath(null),
      DELTA_SECONDS,
      createPlayerWithDeath(null),
    );

    expect(tick.hasRespawned).toBe(false);
  });

  it('should say the player is alive when the moved player is alive', () => {
    const tick = createTickPlayer(
      createStateWithDeath(null),
      DELTA_SECONDS,
      createPlayerWithDeath(null),
    );

    expect(tick.isPlayerAlive).toBe(true);
  });

  it('should say the player is not alive when the moved player has just died', () => {
    const tick = createTickPlayer(
      createStateWithDeath(null),
      DELTA_SECONDS,
      createPlayerWithDeath(0),
    );

    expect(tick.isPlayerAlive).toBe(false);
    expect(tick.hasRespawned).toBe(false);
  });

  it('should pass the same game on when the tick is made', () => {
    const state = createStateWithDeath(null);

    const tick = createTickPlayer(state, DELTA_SECONDS, state.player);

    expect(tick.state).toBe(state);
  });

  it('should pass the same elapsed time on when the tick is made', () => {
    const state = createStateWithDeath(null);

    const tick = createTickPlayer(state, DELTA_SECONDS, state.player);

    expect(tick.deltaSeconds).toBe(DELTA_SECONDS);
  });

  it('should pass the same moved player on when the tick is made', () => {
    const moved = createPlayerWithDeath(null);

    const tick = createTickPlayer(
      createStateWithDeath(null),
      DELTA_SECONDS,
      moved,
    );

    expect(tick.moved).toBe(moved);
  });
});
