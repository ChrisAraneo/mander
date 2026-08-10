import { DOUBLE_HEART, type Item, RED_DIAMOND, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameState } from '../../state/types/game-state';
import type { GameLevel } from '../../types/game-level';
import { capabilitiesFor } from '../player/capabilities-for';
import { BASE_HEARTS } from '../player/consts';
import { chooseItem } from './choose-item';

const trinket = (id: string): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  art: 'GEM',
  effect: { kind: 'NONE' },
});

const chestLevel = (chestItems: Item[]): GameLevel => ({
  seed: 'TEST',
  width: 1,
  height: 1,
  tiles: [[TILE_DIRT]],
  chestItems,
  hornedEnemyChance: 0,
});

const openChest = (chestItems: Item[], inventory: Item[] = []): GameState => ({
  ...createInitialState(chestLevel(chestItems), 0, inventory),
  status: 'CHEST',
  isNearChest: true,
});

const CARRIED_X = 42;
const CARRIED_Y = -7;

const slowed = (state: GameState): GameState => ({
  ...state,
  player: {
    ...state.player,
    velocity: {
      x: { current: CARRIED_X, max: 9 },
      y: { current: CARRIED_Y, max: 9 },
    },
  },
});

describe('chooseItem', () => {
  it('should take the item into the inventory when the chest is open', () => {
    const gem = trinket('GEM');

    expect(chooseItem(openChest([gem]), 0).inventory).toEqual([gem]);
  });

  it('should take the item at the given index when several are offered', () => {
    const state = openChest([trinket('FIRST'), RED_DIAMOND, trinket('LAST')]);
    const chosen = chooseItem(state, 1);

    expect(chosen.inventory).toEqual([RED_DIAMOND]);
    expect(chosen.score).toBe(2500);
  });

  it('should keep what the inventory held when an item is taken', () => {
    const held = trinket('HELD');

    expect(chooseItem(openChest([RED_DIAMOND], [held]), 0).inventory).toEqual([
      held,
      RED_DIAMOND,
    ]);
  });

  it('should shut the chest when an item is taken', () => {
    const chosen = chooseItem(openChest([trinket('GEM')]), 0);

    expect(chosen.status).toBe('PLAYING');
    expect(chosen.isChestOpened).toBe(true);
    expect(chosen.isNearChest).toBe(false);
  });

  it('should add to the score already run up when the item scores', () => {
    const state: GameState = { ...openChest([RED_DIAMOND]), score: 100 };

    expect(chooseItem(state, 0).score).toBe(100 + 2500);
  });

  it('should add to the hearts the player holds when the item heals', () => {
    const state = openChest([DOUBLE_HEART]);

    expect(chooseItem(state, 0).player.hearts.value).toBe(BASE_HEARTS + 2);
  });

  it('should leave score and hearts alone when the item does neither', () => {
    const state: GameState = { ...openChest([trinket('GEM')]), score: 100 };
    const chosen = chooseItem(state, 0);

    expect(chosen.score).toBe(100);
    expect(chosen.player.hearts.value).toBe(BASE_HEARTS);
  });

  it('should restore base capabilities when an item is taken', () => {
    const { velocity } = chooseItem(
      slowed(openChest([trinket('GEM')])),
      0,
    ).player;

    expect(velocity.x.max).toBe(capabilitiesFor().x.max);
    expect(velocity.y.max).toBe(capabilitiesFor().y.max);
  });

  it('should keep the current speed when an item is taken', () => {
    const { velocity } = chooseItem(
      slowed(openChest([trinket('GEM')])),
      0,
    ).player;

    expect(velocity.x.current).toBe(CARRIED_X);
    expect(velocity.y.current).toBe(CARRIED_Y);
  });

  it('should leave the given state untouched when an item is taken', () => {
    const state = openChest([RED_DIAMOND, DOUBLE_HEART]);

    chooseItem(state, 0);

    expect(state.status).toBe('CHEST');
    expect(state.isChestOpened).toBe(false);
    expect(state.inventory).toEqual([]);
    expect(state.score).toBe(0);
    expect(state.player.hearts.value).toBe(BASE_HEARTS);
  });

  it('should leave the state alone when the index runs past the end', () => {
    const state = openChest([RED_DIAMOND]);

    expect(chooseItem(state, 1)).toBe(state);
  });

  it('should leave the state alone when the index falls below zero', () => {
    const state = openChest([RED_DIAMOND]);

    expect(chooseItem(state, -1)).toBe(state);
  });

  it('should leave the state alone when the chest holds no items', () => {
    const state = openChest([]);

    expect(chooseItem(state, 0)).toBe(state);
  });

  it('should leave the state alone when the player is still playing', () => {
    const state: GameState = {
      ...openChest([RED_DIAMOND]),
      status: 'PLAYING',
    };

    expect(chooseItem(state, 0)).toBe(state);
  });

  it('should leave the state alone when the run has already ended', () => {
    const lost: GameState = {
      ...openChest([RED_DIAMOND]),
      status: 'GAME_OVER',
    };
    const won: GameState = { ...openChest([RED_DIAMOND]), status: 'COMPLETE' };

    expect(chooseItem(lost, 0)).toBe(lost);
    expect(chooseItem(won, 0)).toBe(won);
  });
});
