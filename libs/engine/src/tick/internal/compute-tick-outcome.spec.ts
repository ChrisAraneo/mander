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

import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { computeHarmOutcome } from './compute-harm-outcome';
import { computeTickHazards } from './compute-tick-hazards';
import { computeTickOutcome } from './compute-tick-outcome';
import { computeTickPlayer } from './compute-tick-player';
import { computeTickStomps } from './compute-tick-stomps';
import { computeTickVictims } from './compute-tick-victims';
import type { TickStomps } from './types/tick-stomps';
import type { TickVictims } from './types/tick-victims';

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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['..c.....', '...v..f.', 's...e...', '########']);

const DELTA_SECONDS = 0.02;

const DYING_SECONDS = 0.1;

const BASE_STATE = createInitialState(LEVEL, FIRST_LEVEL_INDEX, []);

const createStateWithDeath = (death: number | null): GameState => ({
  ...BASE_STATE,
  input: { isLeft: false, isRight: true, isJump: false },
  player: {
    ...BASE_STATE.player,
    timers: { ...BASE_STATE.player.timers, death },
  },
});

const createTickStompsWithDeath = (death: number | null): TickStomps =>
  computeTickStomps(
    computeTickHazards(
      computeTickPlayer({
        state: createStateWithDeath(death),
        deltaSeconds: DELTA_SECONDS,
      }),
    ),
  );

const createTickVictimsWithDeath = (death: number | null): TickVictims =>
  computeTickVictims(createTickStompsWithDeath(death));

describe('computeTickOutcome', () => {
  it('should give the outcome of the harm when the player is alive', () => {
    const victims = createTickVictimsWithDeath(null);

    const harm = computeTickOutcome(victims);

    expect(victims.isPlayerAlive).toBe(true);
    expect(harm.outcome).toEqual(
      computeHarmOutcome(
        victims.state,
        victims.bounced,
        victims.afterStomps,
        victims.fallingSpikes,
        victims.hits,
        victims.isBurned,
      ),
    );
  });

  it('should keep the player, the deaths and the game going when the player is dying', () => {
    const victims = createTickVictimsWithDeath(DYING_SECONDS);

    const harm = computeTickOutcome(victims);

    expect(victims.isPlayerAlive).toBe(false);
    expect(harm.outcome.player).toBe(victims.bounced);
    expect(harm.outcome.deaths).toBe(victims.state.deaths);
    expect(harm.outcome.status).toBe('PLAYING');
  });

  it('should pass the game, the frame length, the hazards and the victims on when the outcome is worked out', () => {
    const victims = createTickVictimsWithDeath(null);

    const harm = computeTickOutcome(victims);

    expect(harm.state).toBe(victims.state);
    expect(harm.deltaSeconds).toBe(victims.deltaSeconds);
    expect(harm.cannons).toBe(victims.cannons);
    expect(harm.cannonballs).toBe(victims.cannonballs);
    expect(harm.snowballs).toBe(victims.snowballs);
    expect(harm.fallingSpikes).toBe(victims.fallingSpikes);
    expect(harm.fireballs).toBe(victims.fireballs);
    expect(harm.flyingBullets).toBe(victims.flyingBullets);
    expect(harm.afterStomps).toBe(victims.afterStomps);
    expect(harm.gored).toBe(victims.gored);
    expect(harm.hits).toBe(victims.hits);
    expect(harm.chills).toBe(victims.chills);
    expect(harm.isFrozen).toBe(victims.isFrozen);
  });

  it('should leave the victims it was handed untouched when the outcome is worked out', () => {
    const victims = createTickVictimsWithDeath(null);

    computeTickOutcome(victims);

    expect(victims).toEqual(createTickVictimsWithDeath(null));
  });
});
