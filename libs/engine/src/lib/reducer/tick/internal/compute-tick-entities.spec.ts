import {
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
import { head, map, size, tail, take } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { createFiredCannonball } from '../../cannon/create-fired-cannonball';
import { patchCrushedEnemies } from '../../enemy/patch-crushed-enemies';
import { computeTickEntities } from './compute-tick-entities';
import { computeTickHarm } from './compute-tick-harm';
import { computeTickHazards } from './compute-tick-hazards';
import { computeTickPlayer } from './compute-tick-player';
import { computeTickStomps } from './compute-tick-stomps';
import { computeTickVolley } from './compute-tick-volley';
import { filterLeftBehind } from './filter-left-behind';
import type { TickVolley } from './types/tick-volley';

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

const LEVEL = createLevel([
  '..c....c..',
  '...v..f...',
  'sg..e...g.',
  '##########',
]);

const DELTA_SECONDS = 0.02;

const BASE_STATE = createInitialState(LEVEL, 0, []);

const createStateWithDeath = (death: number | null): GameState => ({
  ...BASE_STATE,
  input: { isLeft: false, isRight: true, isJump: false },
  cannonballs: map(BASE_STATE.cannons, createFiredCannonball),
  player: {
    ...BASE_STATE.player,
    position: { x: 34, y: 48 },
    timers: { ...BASE_STATE.player.timers, death },
  },
});

const createTickVolley = (death: number | null): TickVolley =>
  computeTickVolley(
    computeTickHarm(
      computeTickStomps(
        computeTickHazards(
          computeTickPlayer({
            state: createStateWithDeath(death),
            deltaSeconds: DELTA_SECONDS,
          }),
        ),
      ),
    ),
  );

describe('computeTickEntities', () => {
  it('should crush the shot enemies when the entities are updated', () => {
    const tick = createTickVolley(null);

    const entities = computeTickEntities(tick);

    expect(entities.enemies).toEqual(patchCrushedEnemies(tick.shot));
  });

  it('should drop the cannonballs that hit the player from the flying ones when the player is struck', () => {
    const tick = createTickVolley(null);
    const volley: TickVolley = { ...tick, hits: take(tick.flying, 1) };

    const entities = computeTickEntities(volley);

    expect(size(tick.flying)).toBe(2);
    expect(entities.cannonballs).toEqual(tail(tick.flying));
  });

  it('should keep every flying cannonball when no cannonball hits the player', () => {
    const tick = createTickVolley(null);
    const volley: TickVolley = { ...tick, hits: [] };

    const entities = computeTickEntities(volley);

    expect(entities.cannonballs).toEqual(tick.flying);
  });

  it('should let the player reach things and pick up the gems it stands on when the player is alive', () => {
    const tick = createTickVolley(null);

    const entities = computeTickEntities(tick);

    expect(entities.canReach).toBe(true);
    expect(entities.gems).toEqual(
      filterLeftBehind(tick.player, tick.state.gems),
    );
    expect(entities.gems).toEqual([{ x: 8, y: 2 }]);
  });

  it('should not let the player reach things and keep the same gems when the player is dying', () => {
    const tick = createTickVolley(0.1);

    const entities = computeTickEntities(tick);

    expect(entities.canReach).toBe(false);
    expect(entities.gems).toBe(tick.state.gems);
  });

  it('should pass the same game on when the entities are updated', () => {
    const tick = createTickVolley(null);

    const entities = computeTickEntities(tick);

    expect(entities.state).toBe(tick.state);
  });

  it('should pass the same elapsed time on when the entities are updated', () => {
    const tick = createTickVolley(null);

    const entities = computeTickEntities(tick);

    expect(entities.deltaSeconds).toBe(tick.deltaSeconds);
  });

  it('should pass the same cannons on when the entities are updated', () => {
    const tick = createTickVolley(null);

    const entities = computeTickEntities(tick);

    expect(entities.cannons).toBe(tick.cannons);
  });

  it('should pass the same fireballs on when the entities are updated', () => {
    const tick = createTickVolley(null);

    const entities = computeTickEntities(tick);

    expect(entities.fireballs).toBe(tick.fireballs);
  });

  it('should pass the same player on when the entities are updated', () => {
    const tick = createTickVolley(null);

    const entities = computeTickEntities(tick);

    expect(entities.player).toBe(tick.player);
  });

  it('should pass the same deaths on when the entities are updated', () => {
    const tick = createTickVolley(null);

    const entities = computeTickEntities(tick);

    expect(entities.deaths).toBe(tick.deaths);
  });

  it('should pass the same game status on when the entities are updated', () => {
    const tick = createTickVolley(null);

    const entities = computeTickEntities(tick);

    expect(entities.status).toBe(tick.status);
  });

  it('should pass the same bullets on when the entities are updated', () => {
    const tick = createTickVolley(null);

    const entities = computeTickEntities(tick);

    expect(entities.bullets).toBe(tick.bullets);
  });

  it('should pass the same unshot falling spikes on when the entities are updated', () => {
    const tick = createTickVolley(null);

    const entities = computeTickEntities(tick);

    expect(entities.unshot).toBe(tick.unshot);
  });

  it('should pass the same level on when the entities are updated', () => {
    const tick = createTickVolley(null);

    const entities = computeTickEntities(tick);

    expect(entities.level).toBe(tick.level);
  });
});
