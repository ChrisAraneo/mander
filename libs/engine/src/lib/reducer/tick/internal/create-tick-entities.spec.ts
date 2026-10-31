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
import { computeTickHarm } from './compute-tick-harm';
import { computeTickHazards } from './compute-tick-hazards';
import { computeTickPlayer } from './compute-tick-player';
import { computeTickStomps } from './compute-tick-stomps';
import { computeTickVolley } from './compute-tick-volley';
import { createTickEntities } from './create-tick-entities';
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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel([
  '..c....c..',
  '...v..f...',
  'sg..e...g.',
  '##########',
]);

const BASE_STATE = createInitialState(LEVEL, 0, []);

const STATE: GameState = {
  ...BASE_STATE,
  input: { isLeft: false, isRight: true, isJump: false },
  cannonballs: map(BASE_STATE.cannons, createFiredCannonball),
  player: { ...BASE_STATE.player, position: { x: 34, y: 48 } },
};

const TICK: TickVolley = computeTickVolley(
  computeTickHarm(
    computeTickStomps(
      computeTickHazards(
        computeTickPlayer({ state: STATE, deltaSeconds: 0.02 }),
      ),
    ),
  ),
);

describe('createTickEntities', () => {
  it('should crush the shot enemies when the entities are made', () => {
    const entities = createTickEntities(TICK, true);

    expect(entities.enemies).toEqual(patchCrushedEnemies(TICK.shot));
  });

  it('should drop the cannonballs that hit the player from the flying ones when the player is struck', () => {
    const volley: TickVolley = { ...TICK, hits: take(TICK.flying, 1) };

    const entities = createTickEntities(volley, true);

    expect(size(TICK.flying)).toBe(2);
    expect(entities.cannonballs).toEqual(tail(TICK.flying));
  });

  it('should keep every flying cannonball when no cannonball hits the player', () => {
    const volley: TickVolley = { ...TICK, hits: [] };

    const entities = createTickEntities(volley, true);

    expect(entities.cannonballs).toEqual(TICK.flying);
  });

  it('should give no cannonballs when none are flying', () => {
    const volley: TickVolley = { ...TICK, flying: [], hits: [] };

    const entities = createTickEntities(volley, true);

    expect(entities.cannonballs).toEqual([]);
  });

  it('should pick up the gems the player stands on when the player can reach things', () => {
    const entities = createTickEntities(TICK, true);

    expect(entities.canReach).toBe(true);
    expect(entities.gems).toEqual(
      filterLeftBehind(TICK.player, TICK.state.gems),
    );
    expect(entities.gems).toEqual([{ x: 8, y: 2 }]);
  });

  it('should keep the same gems when the player cannot reach things', () => {
    const entities = createTickEntities(TICK, false);

    expect(entities.canReach).toBe(false);
    expect(entities.gems).toBe(TICK.state.gems);
  });

  it('should pass the same game on when the entities are made', () => {
    const entities = createTickEntities(TICK, true);

    expect(entities.state).toBe(TICK.state);
  });

  it('should pass the same elapsed time on when the entities are made', () => {
    const entities = createTickEntities(TICK, true);

    expect(entities.deltaSeconds).toBe(TICK.deltaSeconds);
  });

  it('should pass the same cannons on when the entities are made', () => {
    const entities = createTickEntities(TICK, true);

    expect(entities.cannons).toBe(TICK.cannons);
  });

  it('should pass the same fireballs on when the entities are made', () => {
    const entities = createTickEntities(TICK, true);

    expect(entities.fireballs).toBe(TICK.fireballs);
  });

  it('should pass the same player on when the entities are made', () => {
    const entities = createTickEntities(TICK, true);

    expect(entities.player).toBe(TICK.player);
  });

  it('should pass the same deaths on when the entities are made', () => {
    const entities = createTickEntities(TICK, true);

    expect(entities.deaths).toBe(TICK.deaths);
  });

  it('should pass the same game status on when the entities are made', () => {
    const entities = createTickEntities(TICK, true);

    expect(entities.status).toBe(TICK.status);
  });

  it('should pass the same bullets on when the entities are made', () => {
    const entities = createTickEntities(TICK, true);

    expect(entities.bullets).toBe(TICK.bullets);
  });

  it('should pass the same unshot falling spikes on when the entities are made', () => {
    const entities = createTickEntities(TICK, true);

    expect(entities.unshot).toBe(TICK.unshot);
  });

  it('should pass the same level on when the entities are made', () => {
    const entities = createTickEntities(TICK, true);

    expect(entities.level).toBe(TICK.level);
  });
});
