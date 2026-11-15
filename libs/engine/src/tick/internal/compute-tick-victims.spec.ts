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

import { filterStrikingCannonballs } from '../../cannon/filter-striking-cannonballs';
import { isBurning } from '../../fireball/is-burning';
import { isFreezing } from '../../fireball/is-freezing';
import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { filterChillingSnowballs } from '../../snowball/filter-chilling-snowballs';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { computeTickHazards } from './compute-tick-hazards';
import { computeTickPlayer } from './compute-tick-player';
import { computeTickStomps } from './compute-tick-stomps';
import { computeTickVictims } from './compute-tick-victims';
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

describe('computeTickVictims', () => {
  it('should give the gored enemies, the striking cannonballs and the chilling snowballs when the player is alive', () => {
    const stomps = createTickStompsWithDeath(null);

    const victims = computeTickVictims(stomps);

    expect(stomps.isPlayerAlive).toBe(true);
    expect(victims.gored).toEqual(
      filterHornedVictims(stomps.bounced, stomps.afterStomps),
    );
    expect(victims.hits).toEqual(
      filterStrikingCannonballs(stomps.bounced, stomps.cannonballs),
    );
    expect(victims.chills).toEqual(
      filterChillingSnowballs(stomps.bounced, stomps.snowballs),
    );
  });

  it('should say whether the player is burned or frozen when the player is alive', () => {
    const stomps = createTickStompsWithDeath(null);

    const victims = computeTickVictims(stomps);

    expect(victims.isBurned).toBe(isBurning(stomps.bounced, stomps.fireballs));
    expect(victims.isFrozen).toBe(isFreezing(stomps.bounced, stomps.fireballs));
  });

  it('should harm the player with nothing when the player is dying', () => {
    const stomps = createTickStompsWithDeath(DYING_SECONDS);

    const victims = computeTickVictims(stomps);

    expect(stomps.isPlayerAlive).toBe(false);
    expect(victims.gored).toEqual([]);
    expect(victims.hits).toEqual([]);
    expect(victims.chills).toEqual([]);
    expect(victims.isBurned).toBe(false);
    expect(victims.isFrozen).toBe(false);
  });

  it('should pass the game, the frame length and the hazards on when the victims are picked', () => {
    const stomps = createTickStompsWithDeath(null);

    const victims = computeTickVictims(stomps);

    expect(victims.state).toBe(stomps.state);
    expect(victims.deltaSeconds).toBe(stomps.deltaSeconds);
    expect(victims.isPlayerAlive).toBe(stomps.isPlayerAlive);
    expect(victims.cannons).toBe(stomps.cannons);
    expect(victims.cannonballs).toBe(stomps.cannonballs);
    expect(victims.snowballs).toBe(stomps.snowballs);
    expect(victims.fallingSpikes).toBe(stomps.fallingSpikes);
    expect(victims.fireballs).toBe(stomps.fireballs);
    expect(victims.flyingBullets).toBe(stomps.flyingBullets);
    expect(victims.bounced).toBe(stomps.bounced);
    expect(victims.afterStomps).toBe(stomps.afterStomps);
  });

  it('should leave the stomps it was handed untouched when the victims are picked', () => {
    const stomps = createTickStompsWithDeath(null);

    computeTickVictims(stomps);

    expect(stomps).toEqual(createTickStompsWithDeath(null));
  });
});
