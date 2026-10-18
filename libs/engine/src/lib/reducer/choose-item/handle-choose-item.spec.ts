import {
  DOUBLE_HEART,
  type Item,
  RED_GEM,
  STAR,
  TILE_DIRT,
  TWO_BULLETS,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import type { GameState } from '../../types/game-state';
import { BASE_HEARTS } from '../player/consts';
import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import { handleChooseItem } from './handle-choose-item';

const createTrinket = (id: string): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: { kind: 'NONE' },
});

const createChestLevel = (chestItems: Item[]): GameLevel => ({
  seed: 'TEST',
  width: 1,
  height: 1,
  tiles: [[TILE_DIRT]],
  chestItems,
  hornedEnemyChance: 0,
});

const createChestState = (
  chestItems: Item[],
  inventory: Item[] = [],
): GameState => ({
  ...createInitialState(createChestLevel(chestItems), 0, inventory),
  status: 'CHEST',
  isNearChest: true,
});

const CARRIED_X = 42;

const CARRIED_Y = -7;

const patchPlayerVelocity = (state: GameState): GameState => ({
  ...state,
  player: {
    ...state.player,
    velocity: {
      x: { current: CARRIED_X, max: 9 },
      y: { current: CARRIED_Y, max: 9 },
    },
  },
});

describe('handleChooseItem', () => {
  it('should take the item into the inventory when the chest is open', () => {
    const gem = createTrinket('GEM');

    expect(handleChooseItem(createChestState([gem]), 0).inventory).toEqual([
      gem,
    ]);
  });

  it('should take the item at the given index when several are offered', () => {
    const state = createChestState([
      createTrinket('FIRST'),
      RED_GEM,
      createTrinket('LAST'),
    ]);
    const chosen = handleChooseItem(state, 1);

    expect(chosen.inventory).toEqual([RED_GEM]);
    expect(chosen.score).toBe(1500);
  });

  it('should keep what the inventory held when an item is taken', () => {
    const held = createTrinket('HELD');

    expect(
      handleChooseItem(createChestState([RED_GEM], [held]), 0).inventory,
    ).toEqual([held, RED_GEM]);
  });

  it('should shut the chest when an item is taken', () => {
    const chosen = handleChooseItem(
      createChestState([createTrinket('GEM')]),
      0,
    );

    expect(chosen.status).toBe('PLAYING');
    expect(chosen.isChestOpened).toBe(true);
    expect(chosen.isNearChest).toBe(false);
  });

  it('should add to the score already run up when the item scores', () => {
    const state: GameState = { ...createChestState([RED_GEM]), score: 100 };

    expect(handleChooseItem(state, 0).score).toBe(100 + 1500);
  });

  it('should add to the hearts the player holds when the item heals', () => {
    const state = createChestState([DOUBLE_HEART]);

    expect(handleChooseItem(state, 0).player.hearts.value).toBe(
      BASE_HEARTS + 2,
    );
  });

  it('should leave score and hearts alone when the item does neither', () => {
    const state: GameState = {
      ...createChestState([createTrinket('GEM')]),
      score: 100,
    };
    const chosen = handleChooseItem(state, 0);

    expect(chosen.score).toBe(100);
    expect(chosen.player.hearts.value).toBe(BASE_HEARTS);
  });

  it('should keep what another kind gave when a card of one kind is taken', () => {
    const state = handleChooseItem(
      createChestState([STAR], [TWO_BULLETS, DOUBLE_HEART]),
      0,
    );

    expect(state.stars, 'the star it just took').toBe(1);
    expect(state.ammo, 'and the rounds it was already carrying').toBe(4);
    expect(state.player.hearts.value).toBe(BASE_HEARTS + 2);
  });

  it('should stack every kind the player picks up when one chest follows another', () => {
    const bullets = handleChooseItem(createChestState([TWO_BULLETS]), 0);
    const stars = handleChooseItem(
      { ...bullets, status: 'CHEST', level: createChestLevel([STAR]) },
      0,
    );
    const gem = handleChooseItem(
      { ...stars, status: 'CHEST', level: createChestLevel([RED_GEM]) },
      0,
    );

    expect(gem.ammo, 'the rounds survive the star').toBe(4);
    expect(gem.stars, 'the star survives the gem').toBe(1);
    expect(gem.inventory).toEqual([TWO_BULLETS, STAR, RED_GEM]);
  });

  it('should restore base capabilities when an item is taken', () => {
    const { velocity } = handleChooseItem(
      patchPlayerVelocity(createChestState([createTrinket('GEM')])),
      0,
    ).player;

    expect(velocity.x.max).toBe(createBasePlayerVelocity().x.max);
    expect(velocity.y.max).toBe(createBasePlayerVelocity().y.max);
  });

  it('should keep the current speed when an item is taken', () => {
    const { velocity } = handleChooseItem(
      patchPlayerVelocity(createChestState([createTrinket('GEM')])),
      0,
    ).player;

    expect(velocity.x.current).toBe(CARRIED_X);
    expect(velocity.y.current).toBe(CARRIED_Y);
  });

  it('should leave the given state untouched when an item is taken', () => {
    const state = createChestState([RED_GEM, DOUBLE_HEART]);

    handleChooseItem(state, 0);

    expect(state.status).toBe('CHEST');
    expect(state.isChestOpened).toBe(false);
    expect(state.inventory).toEqual([]);
    expect(state.score).toBe(0);
    expect(state.player.hearts.value).toBe(BASE_HEARTS);
  });

  it('should leave the state alone when the index runs past the end', () => {
    const state = createChestState([RED_GEM]);

    expect(handleChooseItem(state, 1)).toBe(state);
  });

  it('should leave the state alone when the index falls below zero', () => {
    const state = createChestState([RED_GEM]);

    expect(handleChooseItem(state, -1)).toBe(state);
  });

  it('should leave the state alone when the chest holds no items', () => {
    const state = createChestState([]);

    expect(handleChooseItem(state, 0)).toBe(state);
  });

  it('should leave the state alone when the player is still playing', () => {
    const state: GameState = {
      ...createChestState([RED_GEM]),
      status: 'PLAYING',
    };

    expect(handleChooseItem(state, 0)).toBe(state);
  });

  it('should leave the state alone when the run has already ended', () => {
    const lost: GameState = {
      ...createChestState([RED_GEM]),
      status: 'GAME_OVER',
    };
    const won: GameState = {
      ...createChestState([RED_GEM]),
      status: 'COMPLETE',
    };

    expect(handleChooseItem(lost, 0)).toBe(lost);
    expect(handleChooseItem(won, 0)).toBe(won);
  });
});
