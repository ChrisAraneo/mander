import {
  type Item,
  MOON_MAGNET,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { reduce } from '../reduce';
import { createInitialState } from '../../state/create-initial-state';
import type { GameState } from '../../state/types/game-state';
import type { GameLevel } from '../../types/game-level';
import { ACTION_CODES } from '../pack/action-codes';

const WIDTH = 14;
const SPAWN_COLUMN = 2;

const airRow = (): Tile[] => times(WIDTH, () => TILE_AIR);

const groundLevel = (): GameLevel => ({
  seed: 'MOON-TOGGLE-LEVEL',
  width: WIDTH,
  height: 4,
  tiles: [
    airRow(),
    airRow(),
    times(WIDTH, (x) => (x === SPAWN_COLUMN ? TILE_SPAWN : TILE_AIR)),
    times(WIDTH, () => TILE_DIRT),
  ],
  chestItems: [],
  hornedEnemyChance: 0,
});

const trinket = (id: string): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: { kind: 'NONE' },
});

const carrying = (...items: Item[]): GameState =>
  createInitialState(groundLevel(), 0, items);

const toggle = (state: GameState): GameState =>
  reduce(state, { type: 'TOGGLE_MOON_MAGNET' });

describe('calling the moons off with M', () => {
  it('should have the moons circling when a run starts with the magnet', () => {
    const state = carrying(MOON_MAGNET);

    expect(state.isMoonMagnetOn).toBe(true);
    expect(state.playerFireballs).toHaveLength(2);
  });

  it('should send the moons away and bring them back when the toggle is flipped twice', () => {
    const off = toggle(carrying(MOON_MAGNET));

    expect(off.isMoonMagnetOn).toBe(false);
    expect(off.playerFireballs).toEqual([]);

    const on = toggle(off);

    expect(on.isMoonMagnetOn).toBe(true);
    expect(on.playerFireballs).toHaveLength(2);
  });

  it('should leave the player alone when they own no magnet', () => {
    const state = carrying(trinket('GEM'));
    const after = toggle(state);

    expect(after.isMoonMagnetOn).toBe(true);
    expect(after.playerFireballs).toEqual([]);
  });

  it('should keep the moons away when the player respawns', () => {
    const after = reduce(toggle(carrying(MOON_MAGNET)), { type: 'RESPAWN' });

    expect(after.isMoonMagnetOn).toBe(false);
    expect(after.playerFireballs).toEqual([]);
  });

  it('should keep the moons away when the next level loads', () => {
    const after = reduce(toggle(carrying(MOON_MAGNET)), {
      type: 'LOAD_LEVEL',
      level: groundLevel(),
      levelIndex: 1,
    });

    expect(after.isMoonMagnetOn).toBe(false);
    expect(after.playerFireballs).toEqual([]);
  });

  it('should leave the moons a chest hands over dark when the toggle is off', () => {
    const off = toggle(carrying(MOON_MAGNET));
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
    const after = reduce(toggle(carrying(MOON_MAGNET)), {
      type: 'RESTART',
      level: groundLevel(),
    });

    expect(after.isMoonMagnetOn).toBe(true);
  });

  it('should sit last among the action codes when a new action is added, so older replays keep their meaning', () => {
    expect(ACTION_CODES.indexOf('TOGGLE_MOON_MAGNET')).toBe(
      ACTION_CODES.length - 1,
    );
    expect(ACTION_CODES.indexOf('SHOOT')).toBe(13);
  });
});
