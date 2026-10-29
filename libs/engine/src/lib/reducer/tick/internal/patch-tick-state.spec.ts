import {
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_GEM,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { GEM_SCORE } from '../../score/consts';
import { computeTickEntities } from './compute-tick-entities';
import { computeTickHarm } from './compute-tick-harm';
import { computeTickHazards } from './compute-tick-hazards';
import { computeTickPlayer } from './compute-tick-player';
import { computeTickStomps } from './compute-tick-stomps';
import { computeTickVolley } from './compute-tick-volley';
import { patchTickState } from './patch-tick-state';
import type { TickEntities } from './types/tick-entities';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  g: TILE_GEM,
  h: TILE_CHEST,
  k: TILE_KEY,
  p: TILE_PORTAL,
  s: TILE_SPAWN,
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
});

const LEVEL = createLevel([
  '..........',
  '..........',
  'sg.k..hg.p',
  '##########',
]);

const DELTA_SECONDS = 0.02;

const FAR_LEFT = 0;

const NEAR_KEY_LEFT = 100;

const BEYOND_KEY_LEFT = 125;

const NEAR_CHEST_LEFT = 200;

const NEAR_PORTAL_LEFT = 290;

const BASE_STATE = createInitialState(LEVEL, 0, []);

const createState = (overrides: Partial<GameState>): GameState => ({
  ...BASE_STATE,
  time: 1.5,
  score: 1000,
  ...overrides,
});

const createTickEntitiesFromState = (
  overrides: Partial<GameState> = {},
): TickEntities =>
  computeTickEntities(
    computeTickVolley(
      computeTickHarm(
        computeTickStomps(
          computeTickHazards(
            computeTickPlayer({
              state: createState(overrides),
              deltaSeconds: DELTA_SECONDS,
            }),
          ),
        ),
      ),
    ),
  );

const createTickEntitiesAt = (
  left: number,
  canReach: boolean,
  overrides: Partial<GameState> = {},
): TickEntities =>
  pipe(overrides, createTickEntitiesFromState, (entities): TickEntities => ({
    ...entities,
    canReach,
    player: { ...entities.player, position: { x: left, y: 48 } },
  }));

describe('patchTickState', () => {
  it('should add the elapsed time to the time of the level when a tick passes', () => {
    const entities = createTickEntitiesFromState();

    const state = patchTickState(entities);

    expect(state.time).toBeCloseTo(1.52, 6);
  });

  it('should add the gem score for every gem picked up when the player picks up gems', () => {
    const entities: TickEntities = {
      ...createTickEntitiesFromState(),
      gems: [],
    };

    const state = patchTickState(entities);

    expect(size(entities.state.gems)).toBe(2);
    expect(state.score).toBe(1000 + 2 * GEM_SCORE);
  });

  it('should keep the score when the player picks up no gem', () => {
    const tick = createTickEntitiesFromState();
    const entities: TickEntities = { ...tick, gems: tick.state.gems };

    const state = patchTickState(entities);

    expect(state.score).toBe(1000);
  });

  it('should give the player the key when the player can reach and is within the pickup range of the key', () => {
    const entities = createTickEntitiesAt(NEAR_KEY_LEFT, true);

    const state = patchTickState(entities);

    expect(state.hasKey).toBe(true);
  });

  it('should not give the player the key when the player is just beyond the pickup range of the key', () => {
    const entities = createTickEntitiesAt(BEYOND_KEY_LEFT, true);

    const state = patchTickState(entities);

    expect(state.hasKey).toBe(false);
  });

  it('should not give the player the key when the player cannot reach it', () => {
    const entities = createTickEntitiesAt(NEAR_KEY_LEFT, false);

    const state = patchTickState(entities);

    expect(state.hasKey).toBe(false);
  });

  it('should keep the key when the player already has it and is far from the key', () => {
    const entities = createTickEntitiesAt(FAR_LEFT, false, { hasKey: true });

    const state = patchTickState(entities);

    expect(state.hasKey).toBe(true);
  });

  it('should say the player is near the chest when the player can reach and is within the interact range of the chest', () => {
    const entities = createTickEntitiesAt(NEAR_CHEST_LEFT, true);

    const state = patchTickState(entities);

    expect(state.isNearChest).toBe(true);
    expect(state.isNearPortal).toBe(false);
  });

  it('should not say the player is near the chest when the chest is already opened', () => {
    const entities = createTickEntitiesAt(NEAR_CHEST_LEFT, true, {
      isChestOpened: true,
    });

    const state = patchTickState(entities);

    expect(state.isNearChest).toBe(false);
  });

  it('should not say the player is near the chest when the player cannot reach it', () => {
    const entities = createTickEntitiesAt(NEAR_CHEST_LEFT, false);

    const state = patchTickState(entities);

    expect(state.isNearChest).toBe(false);
  });

  it('should say the player is near the portal when the player can reach and is within the interact range of the portal', () => {
    const entities = createTickEntitiesAt(NEAR_PORTAL_LEFT, true);

    const state = patchTickState(entities);

    expect(state.isNearPortal).toBe(true);
    expect(state.isNearChest).toBe(false);
  });

  it('should not say the player is near the portal when the player cannot reach it', () => {
    const entities = createTickEntitiesAt(NEAR_PORTAL_LEFT, false);

    const state = patchTickState(entities);

    expect(state.isNearPortal).toBe(false);
  });

  it('should say the player is near nothing when the player is far from the key, the chest and the portal', () => {
    const entities = createTickEntitiesAt(FAR_LEFT, true);

    const state = patchTickState(entities);

    expect(state.hasKey).toBe(false);
    expect(state.isNearChest).toBe(false);
    expect(state.isNearPortal).toBe(false);
  });

  it('should put the computed level, player, enemies and cannons into the game when a tick passes', () => {
    const entities = createTickEntitiesFromState();

    const state = patchTickState(entities);

    expect(state.level).toBe(entities.level);
    expect(state.player).toBe(entities.player);
    expect(state.enemies).toBe(entities.enemies);
    expect(state.cannons).toBe(entities.cannons);
  });

  it('should put the computed cannonballs, falling spikes, fireballs and bullets into the game when a tick passes', () => {
    const entities = createTickEntitiesFromState();

    const state = patchTickState(entities);

    expect(state.cannonballs).toBe(entities.cannonballs);
    expect(state.fallingSpikes).toBe(entities.unshot);
    expect(state.fireballs).toBe(entities.fireballs);
    expect(state.bullets).toBe(entities.bullets);
  });

  it('should put the computed gems, deaths and status into the game when a tick passes', () => {
    const entities = createTickEntitiesFromState();

    const state = patchTickState(entities);

    expect(state.gems).toBe(entities.gems);
    expect(state.deaths).toBe(entities.deaths);
    expect(state.status).toBe(entities.status);
  });

  it('should keep the rest of the game when a tick passes', () => {
    const entities = createTickEntitiesFromState();

    const state = patchTickState(entities);

    expect(state.input).toBe(entities.state.input);
    expect(state.inventory).toBe(entities.state.inventory);
    expect(state.levelIndex).toBe(entities.state.levelIndex);
  });

  it('should leave the given entities unchanged when a tick passes', () => {
    const entities = createTickEntitiesFromState();

    patchTickState(entities);

    expect(entities).toEqual(createTickEntitiesFromState());
  });
});
