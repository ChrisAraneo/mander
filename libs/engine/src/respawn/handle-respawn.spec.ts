import { describe, expect, it } from 'vitest';

import { createCannons } from '../cannon/create-cannons';
import { createEnemies } from '../enemy/create-enemies';
import { createFallingSpikes } from '../falling-spike/create-falling-spikes';
import { createFireballs } from '../fireball/create-fireballs';
import type { GameState } from '../state/types/game-state';
import { createRespawnTestLevel } from './create-respawn-test-level';
import { createRespawnTestPlayer } from './create-respawn-test-player';
import { createRespawnTestState } from './create-respawn-test-state';
import { handleRespawn } from './handle-respawn';

const LEVEL = createRespawnTestLevel();

describe('handleRespawn', () => {
  it('should put the player back at the spawn with the hearts they had when the level is being played', () => {
    const respawned = handleRespawn(createRespawnTestState());

    expect(respawned.player).toEqual(createRespawnTestPlayer());
  });

  it('should rebuild the enemies, cannons, falling spikes and fireballs from the level when the player respawns', () => {
    const respawned = handleRespawn(createRespawnTestState());

    expect(respawned.enemies).toEqual(createEnemies(LEVEL));
    expect(respawned.cannons).toEqual(createCannons(LEVEL));
    expect(respawned.fallingSpikes).toEqual(createFallingSpikes(LEVEL));
    expect(respawned.fireballs).toEqual(createFireballs(LEVEL));
    expect(respawned.enemies).toHaveLength(1);
    expect(respawned.cannons).toHaveLength(1);
    expect(respawned.fallingSpikes).toHaveLength(1);
    expect(respawned.fireballs).toHaveLength(1);
  });

  it('should clear every cannonball and bullet in the air when the player respawns', () => {
    const respawned = handleRespawn(createRespawnTestState());

    expect(respawned.cannonballs).toEqual([]);
    expect(respawned.bullets).toEqual([]);
  });

  it('should keep the score, time, deaths and inventory when the player respawns', () => {
    const state = createRespawnTestState();

    const respawned = handleRespawn(state);

    expect(respawned).toEqual({
      ...state,
      player: createRespawnTestPlayer(),
      enemies: createEnemies(LEVEL),
      cannons: createCannons(LEVEL),
      cannonballs: [],
      fallingSpikes: createFallingSpikes(LEVEL),
      fireballs: createFireballs(LEVEL),
      bullets: [],
    });
  });

  it('should change nothing when the chest is open', () => {
    const state: GameState = {
      ...createRespawnTestState(),
      status: 'CHEST',
    };

    const respawned = handleRespawn(state);

    expect(respawned).toBe(state);
  });

  it('should change nothing when the level is complete', () => {
    const state: GameState = {
      ...createRespawnTestState(),
      status: 'COMPLETE',
    };

    const respawned = handleRespawn(state);

    expect(respawned).toBe(state);
  });

  it('should leave the game it was handed untouched when the player respawns', () => {
    const state = createRespawnTestState();

    handleRespawn(state);

    expect(state).toEqual(createRespawnTestState());
  });
});
