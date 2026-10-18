import {
  type Item,
  MOON_MAGNET,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { indexOf, size, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { ACTION_CODES } from './pack/action-codes';
import { reduce } from './reduce';

const WIDTH = 14;

const SPAWN_COLUMN = 2;

const createAirRow = (): Tile[] => times(WIDTH, () => TILE_AIR);

const createGroundLevel = (): GameLevel => ({
  seed: 'MOON-TOGGLE-LEVEL',
  width: WIDTH,
  height: 4,
  tiles: [
    createAirRow(),
    createAirRow(),
    times(WIDTH, (column) =>
      match(column === SPAWN_COLUMN)
        .with(true, (): Tile => TILE_SPAWN)
        .otherwise((): Tile => TILE_AIR),
    ),
    times(WIDTH, () => TILE_DIRT),
  ],
  chestItems: [],
  hornedEnemyChance: 0,
});

const createTrinket = (id: string): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: { kind: 'NONE' },
});

const createStateCarrying = (...items: Item[]): GameState =>
  createInitialState(createGroundLevel(), 0, items);

const nextMagnetToggle = (state: GameState): GameState =>
  reduce(state, { type: 'TOGGLE_MOON_MAGNET' });

describe('calling the moons off with M', () => {
  it('should have the moons circling when a run starts with the magnet', () => {
    const state = createStateCarrying(MOON_MAGNET);

    expect(state.isMoonMagnetOn).toBe(true);
    expect(state.playerFireballs).toHaveLength(2);
  });

  it('should send the moons away and bring them back when the toggle is flipped twice', () => {
    const off = nextMagnetToggle(createStateCarrying(MOON_MAGNET));

    expect(off.isMoonMagnetOn).toBe(false);
    expect(off.playerFireballs).toEqual([]);

    const on = nextMagnetToggle(off);

    expect(on.isMoonMagnetOn).toBe(true);
    expect(on.playerFireballs).toHaveLength(2);
  });

  it('should leave the player alone when they own no magnet', () => {
    const state = createStateCarrying(createTrinket('GEM'));
    const after = nextMagnetToggle(state);

    expect(after.isMoonMagnetOn).toBe(true);
    expect(after.playerFireballs).toEqual([]);
  });

  it('should keep the moons away when the player respawns', () => {
    const after = reduce(nextMagnetToggle(createStateCarrying(MOON_MAGNET)), {
      type: 'RESPAWN',
    });

    expect(after.isMoonMagnetOn).toBe(false);
    expect(after.playerFireballs).toEqual([]);
  });

  it('should keep the moons away when the next level loads', () => {
    const after = reduce(nextMagnetToggle(createStateCarrying(MOON_MAGNET)), {
      type: 'LOAD_LEVEL',
      level: createGroundLevel(),
      levelIndex: 1,
    });

    expect(after.isMoonMagnetOn).toBe(false);
    expect(after.playerFireballs).toEqual([]);
  });

  it('should leave the moons a chest hands over dark when the toggle is off', () => {
    const off = nextMagnetToggle(createStateCarrying(MOON_MAGNET));
    const picked = reduce(
      {
        ...off,
        status: 'CHEST',
        level: { ...off.level, chestItems: [MOON_MAGNET] },
      },
      { type: 'CHOOSE_ITEM', index: 0 },
    );

    expect(picked.inventory).toHaveLength(2);
    expect(picked.playerFireballs).toEqual([]);
  });

  it('should give the moons back when a fresh run starts', () => {
    const after = reduce(nextMagnetToggle(createStateCarrying(MOON_MAGNET)), {
      type: 'RESTART',
      level: createGroundLevel(),
    });

    expect(after.isMoonMagnetOn).toBe(true);
  });

  it('should sit last among the action codes when a new action is added, so older replays keep their meaning', () => {
    expect(indexOf(ACTION_CODES, 'TOGGLE_MOON_MAGNET')).toBe(
      size(ACTION_CODES) - 1,
    );
    expect(indexOf(ACTION_CODES, 'SHOOT')).toBe(13);
  });
});
