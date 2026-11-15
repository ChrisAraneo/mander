import { describe, expect, it } from 'vitest';

import { createCannons } from '../../cannon/create-cannons';
import { createEnemies } from '../../enemy/create-enemies';
import { createFallingSpikes } from '../../falling-spike/create-falling-spikes';
import { createFireballs } from '../../fireball/create-fireballs';
import { createRespawnTestLevel } from '../create-respawn-test-level';
import { createRespawnTestPlayer } from '../create-respawn-test-player';
import { createRespawnTestState } from '../create-respawn-test-state';
import { patchRespawnedState } from './patch-respawned-state';

const LEVEL = createRespawnTestLevel();

describe('patchRespawnedState', () => {
  it('should put the player back at the spawn and rebuild the level dangers when the player respawns', () => {
    const respawned = patchRespawnedState(createRespawnTestState());

    expect(respawned.player).toEqual(createRespawnTestPlayer());
    expect(respawned.enemies).toEqual(createEnemies(LEVEL));
    expect(respawned.cannons).toEqual(createCannons(LEVEL));
    expect(respawned.fallingSpikes).toEqual(createFallingSpikes(LEVEL));
    expect(respawned.fireballs).toEqual(createFireballs(LEVEL));
  });

  it('should clear every bullet and cannonball when the player respawns', () => {
    const respawned = patchRespawnedState(createRespawnTestState());

    expect(respawned.cannonballs).toEqual([]);
    expect(respawned.bullets).toEqual([]);
  });

  it('should leave the game it was handed untouched when the player respawns', () => {
    const state = createRespawnTestState();

    patchRespawnedState(state);

    expect(state).toEqual(createRespawnTestState());
  });
});
