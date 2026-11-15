import {
  type Snowball,
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
import { COLD_SECONDS } from '../../player/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { computeTickHazards } from './compute-tick-hazards';
import { computeTickOutcome } from './compute-tick-outcome';
import { computeTickPlayer } from './compute-tick-player';
import { computeTickStomps } from './compute-tick-stomps';
import { computeTickVictims } from './compute-tick-victims';
import { createTickHarm } from './create-tick-harm';
import type { TickHarmOutcome } from './types/tick-harm-outcome';
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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['..c.....', '...v..f.', 's...e...', '########']);

const DELTA_SECONDS = 0.02;

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

const createTickHarmOutcomeWithDeath = (
  death: number | null,
): TickHarmOutcome =>
  computeTickOutcome(computeTickVictims(createTickStompsWithDeath(death)));

const SNOWBALL_X = 100;

const SNOWBALL_Y = 32;

const SNOWBALL_SPEED = 120;

const createChill = (): Snowball => ({
  position: { x: SNOWBALL_X, y: SNOWBALL_Y },
  velocity: { x: { current: SNOWBALL_SPEED, max: SNOWBALL_SPEED } },
});

describe('createTickHarm', () => {
  it('should take the player, the deaths and the status from the outcome when the harm is gathered', () => {
    const outcome = createTickHarmOutcomeWithDeath(null);

    const harm = createTickHarm(outcome);

    expect(harm.player).toEqual(outcome.outcome.player);
    expect(harm.deaths).toBe(outcome.outcome.deaths);
    expect(harm.status).toBe(outcome.outcome.status);
  });

  it('should put the cold on the player when a snowball chilled them', () => {
    const harm = createTickHarm({
      ...createTickHarmOutcomeWithDeath(null),
      chills: [createChill()],
    });

    expect(harm.player.timers.cold).toBe(COLD_SECONDS);
  });

  it('should put the cold on the player when an ice ball swept through them', () => {
    const harm = createTickHarm({
      ...createTickHarmOutcomeWithDeath(null),
      isFrozen: true,
    });

    expect(harm.player.timers.cold).toBe(COLD_SECONDS);
  });

  it('should leave the player cold free when neither a snowball nor an ice ball touched them', () => {
    const outcome = createTickHarmOutcomeWithDeath(null);

    const harm = createTickHarm({ ...outcome, chills: [], isFrozen: false });

    expect(harm.player).toBe(outcome.outcome.player);
  });

  it('should pass the game, the frame length, the hazards and the victims on when the harm is gathered', () => {
    const outcome = createTickHarmOutcomeWithDeath(null);

    const harm = createTickHarm(outcome);

    expect(harm.state).toBe(outcome.state);
    expect(harm.deltaSeconds).toBe(outcome.deltaSeconds);
    expect(harm.cannons).toBe(outcome.cannons);
    expect(harm.cannonballs).toBe(outcome.cannonballs);
    expect(harm.snowballs).toBe(outcome.snowballs);
    expect(harm.fallingSpikes).toBe(outcome.fallingSpikes);
    expect(harm.fireballs).toBe(outcome.fireballs);
    expect(harm.flyingBullets).toBe(outcome.flyingBullets);
    expect(harm.afterStomps).toBe(outcome.afterStomps);
    expect(harm.gored).toBe(outcome.gored);
    expect(harm.hits).toBe(outcome.hits);
    expect(harm.chills).toBe(outcome.chills);
  });

  it('should leave the outcome it was handed untouched when the harm is gathered', () => {
    const outcome = createTickHarmOutcomeWithDeath(null);

    createTickHarm(outcome);

    expect(outcome).toEqual(createTickHarmOutcomeWithDeath(null));
  });
});
