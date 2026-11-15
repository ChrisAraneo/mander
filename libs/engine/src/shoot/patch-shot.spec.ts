import {
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
  TWO_BULLETS,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createFiredBullet } from '../bullet/create-fired-bullet';
import { FIRST_LEVEL_INDEX } from '../load-level/consts';
import { createInitialState } from '../start/create-initial-state';
import type { GameLevel } from '../state/types/game-level';
import type { GameState } from '../state/types/game-state';
import { patchShot } from './patch-shot';

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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.S...', '#####']);

const createState = (): GameState =>
  createInitialState(LEVEL, FIRST_LEVEL_INDEX, [TWO_BULLETS]);

const LOADED_AMMO = createState().ammo;

const createDyingState = (): GameState => ({
  ...createState(),
  player: {
    ...createState().player,
    timers: { ...createState().player.timers, death: 0.5 },
  },
});

describe('patchShot', () => {
  it('should use up one bullet when the player shoots in a level being played', () => {
    const shot = patchShot(createState());

    expect(shot.ammo).toBe(LOADED_AMMO - 1);
  });

  it('should fire a bullet from the player when the player shoots in a level being played', () => {
    const state = createState();

    const shot = patchShot(state);

    expect(shot.bullets).toEqual([createFiredBullet(state.player)]);
  });

  it('should add the new bullet after the ones in flight when the player shoots again', () => {
    const state = createState();
    const firstShot = patchShot(state);

    const secondShot = patchShot(firstShot);

    expect(secondShot.bullets).toEqual([
      createFiredBullet(state.player),
      createFiredBullet(state.player),
    ]);
    expect(secondShot.ammo).toBe(LOADED_AMMO - 2);
  });

  it('should leave the rest of the game alone when the player shoots', () => {
    const state = createState();

    const shot = patchShot(state);

    expect(shot).toEqual({
      ...state,
      ammo: LOADED_AMMO - 1,
      bullets: [createFiredBullet(state.player)],
    });
  });

  it('should leave the state it was given unchanged when the player shoots', () => {
    const state = createState();

    patchShot(state);

    expect(state).toEqual(createState());
  });

  it('should change nothing when the player has no bullets', () => {
    const state: GameState = {
      ...createInitialState(LEVEL, FIRST_LEVEL_INDEX, []),
      ammo: 0,
    };

    const shot = patchShot(state);

    expect(shot).toBe(state);
  });

  it('should change nothing when the player is dying', () => {
    const state = createDyingState();

    const shot = patchShot(state);

    expect(shot).toBe(state);
  });

  it('should change nothing when the chest is open', () => {
    const state: GameState = { ...createState(), status: 'CHEST' };

    const shot = patchShot(state);

    expect(shot).toBe(state);
  });

  it('should change nothing when the level is complete', () => {
    const state: GameState = { ...createState(), status: 'COMPLETE' };

    const shot = patchShot(state);

    expect(shot).toBe(state);
  });

  it('should change nothing when the game is over', () => {
    const state: GameState = { ...createState(), status: 'GAME_OVER' };

    const shot = patchShot(state);

    expect(shot).toBe(state);
  });
});
