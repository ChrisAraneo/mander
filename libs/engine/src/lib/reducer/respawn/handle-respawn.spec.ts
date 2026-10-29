import {
  RED_GEM,
  type Player,
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

import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import type { GameState } from '../../types/game-state';
import { createCannons } from '../cannon/create-cannons';
import { createEnemies } from '../enemy/create-enemies';
import { createFallingSpikes } from '../falling-spike/create-falling-spikes';
import { createFireballs } from '../fireball/create-fireballs';
import { createPlayer } from '../player/create-player';
import { handleRespawn } from './handle-respawn';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
  E: TILE_ENEMY,
  c: TILE_CANNON,
  v: TILE_SPIKE_FALLING,
  f: TILE_FIREBALL,
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

const LEVEL = createLevel([
  '..........',
  '.v....f...',
  '.S..E...c.',
  '##########',
]);

const patchRespawnState = (initial: GameState): GameState => ({
  ...initial,
  player: {
    ...initial.player,
    position: { x: 200, y: 10 },
    hearts: { value: 1 },
  },
  enemies: [],
  cannons: [],
  cannonballs: [
    {
      position: { x: 100, y: 64 },
      velocity: { x: { current: 5, max: 5 } },
    },
  ],
  fallingSpikes: [],
  fireballs: [],
  bullets: [
    {
      position: { x: 120, y: 64 },
      velocity: { x: { current: 8, max: 8 } },
    },
  ],
  score: 40,
  time: 12,
  deaths: 2,
});

const createState = (): GameState =>
  patchRespawnState(createInitialState(LEVEL, 0, [RED_GEM]));

const createSpawnedPlayer = (): Player =>
  createPlayer(LEVEL, { hearts: { value: 1 } });

describe('handleRespawn', () => {
  it('should put the player back at the spawn with the hearts they had when the level is being played', () => {
    const respawned = handleRespawn(createState());

    expect(respawned.player).toEqual(createSpawnedPlayer());
  });

  it('should rebuild the enemies, cannons, falling spikes and fireballs from the level when the player respawns', () => {
    const respawned = handleRespawn(createState());

    expect(respawned.enemies).toEqual(createEnemies(LEVEL));
    expect(respawned.cannons).toEqual(createCannons(LEVEL));
    expect(respawned.fallingSpikes).toEqual(createFallingSpikes(LEVEL));
    expect(respawned.fireballs).toEqual(createFireballs(LEVEL));
    expect(respawned.enemies).toHaveLength(1);
    expect(respawned.cannons).toHaveLength(1);
    expect(respawned.fallingSpikes).toHaveLength(1);
    expect(respawned.fireballs).toHaveLength(1);
  });

  it('should clear every bullet and cannonball when the player respawns', () => {
    const respawned = handleRespawn(createState());

    expect(respawned.bullets).toEqual([]);
    expect(respawned.cannonballs).toEqual([]);
  });

  it('should keep the score, time, deaths and inventory when the player respawns', () => {
    const state = createState();

    const respawned = handleRespawn(state);

    expect(respawned).toEqual({
      ...state,
      player: createSpawnedPlayer(),
      enemies: createEnemies(LEVEL),
      cannons: createCannons(LEVEL),
      cannonballs: [],
      fallingSpikes: createFallingSpikes(LEVEL),
      fireballs: createFireballs(LEVEL),
      bullets: [],
    });
  });

  it('should hand back the same state when the chest is open', () => {
    const state: GameState = { ...createState(), status: 'CHEST' };

    const respawned = handleRespawn(state);

    expect(respawned).toBe(state);
  });

  it('should hand back the same state when the level is complete', () => {
    const state: GameState = { ...createState(), status: 'COMPLETE' };

    const respawned = handleRespawn(state);

    expect(respawned).toBe(state);
  });

  it('should hand back the same state when the game is over', () => {
    const state: GameState = { ...createState(), status: 'GAME_OVER' };

    const respawned = handleRespawn(state);

    expect(respawned).toBe(state);
  });

  it('should leave the given state unchanged when the player respawns', () => {
    const state = createState();

    handleRespawn(state);

    expect(state).toEqual(createState());
  });
});
