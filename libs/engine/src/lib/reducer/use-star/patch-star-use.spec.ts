import {
  STAR,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import type { GameState } from '../../types/game-state';
import { STAR_INVINCIBLE_SECONDS } from '../player/consts';
import { patchStarUse } from './patch-star-use';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
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

const LEVEL = createLevel(['.....', '.S...', '#####']);

const createState = (): GameState => createInitialState(LEVEL, 0, [STAR, STAR]);

const createShieldedState = (): GameState => ({
  ...createState(),
  player: {
    ...createState().player,
    timers: { ...createState().player.timers, invincibility: 5, star: 4 },
  },
});

const createDyingState = (): GameState => ({
  ...createState(),
  player: {
    ...createState().player,
    timers: { ...createState().player.timers, death: 0.5 },
  },
});

describe('patchStarUse', () => {
  it('should use up one star when the player uses a star in a level being played', () => {
    const used = patchStarUse(createState());

    expect(used.stars).toBe(1);
  });

  it('should make the player invincible for the star time when the player uses a star', () => {
    const used = patchStarUse(createState());

    expect(used.player.timers).toEqual({
      death: null,
      invincibility: STAR_INVINCIBLE_SECONDS,
      star: STAR_INVINCIBLE_SECONDS,
      hurt: 0,
    });
  });

  it('should keep the longer timers when the player is already invincible for longer', () => {
    const used = patchStarUse(createShieldedState());

    expect(used.player.timers.invincibility).toBe(5);
    expect(used.player.timers.star).toBe(4);
  });

  it('should leave the rest of the state alone when the player uses a star', () => {
    const state = createState();

    const used = patchStarUse(state);

    expect(used).toEqual({
      ...state,
      stars: 1,
      player: {
        ...state.player,
        timers: {
          ...state.player.timers,
          invincibility: STAR_INVINCIBLE_SECONDS,
          star: STAR_INVINCIBLE_SECONDS,
        },
      },
    });
  });

  it('should leave the state it was given unchanged when the player uses a star', () => {
    const state = createState();

    patchStarUse(state);

    expect(state).toEqual(createState());
  });

  it('should give back the same state when the player has no stars', () => {
    const state = createInitialState(LEVEL, 0, []);

    const used = patchStarUse(state);

    expect(used).toBe(state);
  });

  it('should give back the same state when the player is dying', () => {
    const state = createDyingState();

    const used = patchStarUse(state);

    expect(used).toBe(state);
  });

  it('should give back the same state when the chest is open', () => {
    const state: GameState = { ...createState(), status: 'CHEST' };

    const used = patchStarUse(state);

    expect(used).toBe(state);
  });

  it('should give back the same state when the level is complete', () => {
    const state: GameState = { ...createState(), status: 'COMPLETE' };

    const used = patchStarUse(state);

    expect(used).toBe(state);
  });

  it('should give back the same state when the game is over', () => {
    const state: GameState = { ...createState(), status: 'GAME_OVER' };

    const used = patchStarUse(state);

    expect(used).toBe(state);
  });
});
