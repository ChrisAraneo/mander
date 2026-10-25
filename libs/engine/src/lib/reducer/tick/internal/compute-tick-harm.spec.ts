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
import { filterStrikingCannonballs } from '../../cannon/filter-striking-cannonballs';
import { isBurning } from '../../fireball/is-burning';
import { computeHarmOutcome } from './compute-harm-outcome';
import { computeTickHarm } from './compute-tick-harm';
import { computeTickHazards } from './compute-tick-hazards';
import { computeTickPlayer } from './compute-tick-player';
import { computeTickStomps } from './compute-tick-stomps';
import { filterHornedVictims } from './filter-horned-victims';
import type { TickStomps } from './types/tick-stomps';

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

const createTickStompsWithDeath = (death: number | null): TickStomps =>
  computeTickStomps(
    computeTickHazards(
      computeTickPlayer({
        state: createStateWithDeath(death),
        deltaSeconds: DELTA_SECONDS,
      }),
    ),
  );

describe('computeTickHarm', () => {
  it('should give the gored enemies when the player is alive', () => {
    const tick = createTickStompsWithDeath(null);

    const harm = computeTickHarm(tick);

    expect(tick.isPlayerAlive).toBe(true);
    expect(harm.gored).toEqual(
      filterHornedVictims(tick.bounced, tick.afterStomps),
    );
  });

  it('should give the striking cannonballs when the player is alive', () => {
    const tick = createTickStompsWithDeath(null);

    const harm = computeTickHarm(tick);

    expect(harm.hits).toEqual(
      filterStrikingCannonballs(tick.bounced, tick.flying),
    );
  });

  it('should give the outcome of the harm when the player is alive', () => {
    const tick = createTickStompsWithDeath(null);

    const harm = computeTickHarm(tick);

    expect({
      player: harm.player,
      deaths: harm.deaths,
      status: harm.status,
    }).toEqual(
      computeHarmOutcome(
        tick.state,
        tick.bounced,
        tick.afterStomps,
        tick.fallingSpikes,
        filterStrikingCannonballs(tick.bounced, tick.flying),
        isBurning(tick.bounced, tick.fireballs),
      ),
    );
  });

  it('should give no gored enemies and no hits when the player is dying', () => {
    const tick = createTickStompsWithDeath(0.1);

    const harm = computeTickHarm(tick);

    expect(tick.isPlayerAlive).toBe(false);
    expect(harm.gored).toEqual([]);
    expect(harm.hits).toEqual([]);
  });

  it('should keep the player, the deaths and the game going when the player is dying', () => {
    const tick = createTickStompsWithDeath(0.1);

    const harm = computeTickHarm(tick);

    expect(harm.player).toBe(tick.bounced);
    expect(harm.deaths).toBe(tick.state.deaths);
    expect(harm.status).toBe('PLAYING');
  });

  it('should pass the same game on when the player is harmed', () => {
    const tick = createTickStompsWithDeath(null);

    const harm = computeTickHarm(tick);

    expect(harm.state).toBe(tick.state);
  });

  it('should pass the same elapsed time on when the player is harmed', () => {
    const tick = createTickStompsWithDeath(null);

    const harm = computeTickHarm(tick);

    expect(harm.deltaSeconds).toBe(tick.deltaSeconds);
  });

  it('should pass the same cannons on when the player is harmed', () => {
    const tick = createTickStompsWithDeath(null);

    const harm = computeTickHarm(tick);

    expect(harm.cannons).toBe(tick.cannons);
  });

  it('should pass the same flying cannonballs on when the player is harmed', () => {
    const tick = createTickStompsWithDeath(null);

    const harm = computeTickHarm(tick);

    expect(harm.flying).toBe(tick.flying);
  });

  it('should pass the same falling spikes on when the player is harmed', () => {
    const tick = createTickStompsWithDeath(null);

    const harm = computeTickHarm(tick);

    expect(harm.fallingSpikes).toBe(tick.fallingSpikes);
  });

  it('should pass the same fireballs on when the player is harmed', () => {
    const tick = createTickStompsWithDeath(null);

    const harm = computeTickHarm(tick);

    expect(harm.fireballs).toBe(tick.fireballs);
  });

  it('should pass the same flying bullets on when the player is harmed', () => {
    const tick = createTickStompsWithDeath(null);

    const harm = computeTickHarm(tick);

    expect(harm.flyingBullets).toBe(tick.flyingBullets);
  });

  it('should pass the same enemies after the stomps on when the player is harmed', () => {
    const tick = createTickStompsWithDeath(null);

    const harm = computeTickHarm(tick);

    expect(harm.afterStomps).toBe(tick.afterStomps);
  });
});
