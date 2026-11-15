import { RED_GEM } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createRespawnTestState } from './create-respawn-test-state';

const CARRIED_HEARTS = 1;

const CARRIED_SCORE = 40;

const CARRIED_TIME = 12;

const CARRIED_DEATHS = 2;

const PLAYER_X = 200;

const PLAYER_Y = 10;

describe('createRespawnTestState', () => {
  it('should wipe the level dangers and leave a shot in the air when it builds the game', () => {
    const state = createRespawnTestState();

    expect(state.enemies).toEqual([]);
    expect(state.cannons).toEqual([]);
    expect(state.fallingSpikes).toEqual([]);
    expect(state.fireballs).toEqual([]);
    expect(state.cannonballs).toHaveLength(1);
    expect(state.bullets).toHaveLength(1);
  });

  it('should carry the score, the time, the deaths and the gem when it builds the game', () => {
    const state = createRespawnTestState();

    expect(state.score).toBe(CARRIED_SCORE);
    expect(state.time).toBe(CARRIED_TIME);
    expect(state.deaths).toBe(CARRIED_DEATHS);
    expect(state.inventory).toEqual([RED_GEM]);
  });

  it('should move the player away from the spawn with fewer hearts when it builds the game', () => {
    const state = createRespawnTestState();

    expect(state.player.hearts).toEqual({ value: CARRIED_HEARTS });
    expect(state.player.position).toEqual({ x: PLAYER_X, y: PLAYER_Y });
  });

  it('should build a game of its own each time it is called', () => {
    expect(createRespawnTestState()).not.toBe(createRespawnTestState());
    expect(createRespawnTestState()).toEqual(createRespawnTestState());
  });
});
