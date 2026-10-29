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
import { computeTickBounce } from './compute-tick-bounce';
import { computeTickHazards } from './compute-tick-hazards';
import { computeTickPlayer } from './compute-tick-player';
import { patchStompBounce } from './patch-stomp-bounce';
import type { TickHazards } from './types/tick-hazards';

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
  shooterEnemyChance: 0,
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

const createTickHazards = (death: number | null): TickHazards =>
  computeTickHazards(
    computeTickPlayer({
      state: createStateWithDeath(death),
      deltaSeconds: DELTA_SECONDS,
    }),
  );

describe('computeTickBounce', () => {
  it('should give the player and enemies after the stomps when the player is alive', () => {
    const tick = createTickHazards(null);

    const bounce = computeTickBounce(tick);

    expect(tick.isPlayerAlive).toBe(true);
    expect(bounce).toEqual(
      patchStompBounce(
        tick.state.player,
        tick.moved,
        tick.steppedEnemies,
        tick.state.input.isJump,
        DELTA_SECONDS,
      ),
    );
  });

  it('should give the same moved player when the player is dying', () => {
    const tick = createTickHazards(0.1);

    const bounce = computeTickBounce(tick);

    expect(tick.isPlayerAlive).toBe(false);
    expect(bounce.player).toBe(tick.moved);
  });

  it('should give the same moved enemies when the player is dying', () => {
    const tick = createTickHazards(0.1);

    const bounce = computeTickBounce(tick);

    expect(bounce.enemies).toBe(tick.steppedEnemies);
  });

  it('should give no enemies when there are no enemies and the player is alive', () => {
    const tick: TickHazards = {
      ...createTickHazards(null),
      steppedEnemies: [],
    };

    const bounce = computeTickBounce(tick);

    expect(bounce.enemies).toEqual([]);
  });
});
