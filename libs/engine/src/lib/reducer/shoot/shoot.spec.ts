import {
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
  TWO_BULLETS,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import type { GameState } from '../../types/game-state';
import { fireBullet } from '../bullet/fire-bullet';
import { shoot } from './shoot';

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
});

const LEVEL = createLevel(['.....', '.S...', '#####']);

const createState = (): GameState =>
  createInitialState(LEVEL, 0, [TWO_BULLETS]);

const createDyingState = (): GameState => ({
  ...createState(),
  player: {
    ...createState().player,
    timers: { ...createState().player.timers, death: 0.5 },
  },
});

describe('shoot', () => {
  it('should use up one bullet when the player shoots in a level being played', () => {
    const shot = shoot(createState());

    expect(shot.ammo).toBe(3);
  });

  it('should fire a bullet from the player when the player shoots in a level being played', () => {
    const state = createState();

    const shot = shoot(state);

    expect(shot.bullets).toEqual([fireBullet(state.player)]);
  });

  it('should add the new bullet after the ones in flight when the player shoots again', () => {
    const state = createState();
    const firstShot = shoot(state);

    const secondShot = shoot(firstShot);

    expect(secondShot.bullets).toEqual([
      fireBullet(state.player),
      fireBullet(state.player),
    ]);
    expect(secondShot.ammo).toBe(2);
  });

  it('should leave the rest of the state alone when the player shoots', () => {
    const state = createState();

    const shot = shoot(state);

    expect(shot).toEqual({
      ...state,
      ammo: 3,
      bullets: [fireBullet(state.player)],
    });
  });

  it('should leave the state it was given unchanged when the player shoots', () => {
    const state = createState();

    shoot(state);

    expect(state).toEqual(createState());
  });

  it('should give back the same state when the player has no bullets', () => {
    const state = createInitialState(LEVEL, 0, []);

    const shot = shoot(state);

    expect(shot).toBe(state);
  });

  it('should give back the same state when the player is dying', () => {
    const state = createDyingState();

    const shot = shoot(state);

    expect(shot).toBe(state);
  });

  it('should give back the same state when the chest is open', () => {
    const state: GameState = { ...createState(), status: 'CHEST' };

    const shot = shoot(state);

    expect(shot).toBe(state);
  });

  it('should give back the same state when the level is complete', () => {
    const state: GameState = { ...createState(), status: 'COMPLETE' };

    const shot = shoot(state);

    expect(shot).toBe(state);
  });

  it('should give back the same state when the game is over', () => {
    const state: GameState = { ...createState(), status: 'GAME_OVER' };

    const shot = shoot(state);

    expect(shot).toBe(state);
  });
});
