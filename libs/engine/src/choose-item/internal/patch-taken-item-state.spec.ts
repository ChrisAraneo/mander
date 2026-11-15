import {
  type Item,
  RED_GEM,
  STAR,
  TILE_DIRT,
  TWO_BULLETS,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { getBulletsAmount } from '../../item/get-bullets-amount';
import { getScoreAmount } from '../../item/get-score-amount';
import { getStarsAmount } from '../../item/get-stars-amount';
import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { patchTakenItemState } from './patch-taken-item-state';

const HELD_SCORE = 100;
const HELD_AMMO = 3;
const HELD_STARS = 2;

const HELD_ITEM: Item = {
  id: 'HELD',
  name: 'Held',
  description: 'Already carried by the player',
  rarity: 'COMMON',
  effect: { kind: 'NONE' },
};

const LEVEL: GameLevel = {
  seed: 'TEST',
  width: 1,
  height: 1,
  tiles: [[TILE_DIRT]],
  chestItems: [RED_GEM],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
};

const patchChestState = (initial: GameState): GameState => ({
  ...initial,
  status: 'CHEST',
  isNearChest: true,
  score: HELD_SCORE,
  ammo: HELD_AMMO,
  stars: HELD_STARS,
});

const createState = (): GameState =>
  patchChestState(createInitialState(LEVEL, FIRST_LEVEL_INDEX, [HELD_ITEM]));

const patchState = (item: Item): GameState =>
  patchTakenItemState({
    state: createState(),
    item,
    player: createState().player,
  });

describe('patchTakenItemState', () => {
  it('should shut the chest and add the item to the inventory when the player takes it', () => {
    const patched = patchState(RED_GEM);

    expect(patched.status).toBe('PLAYING');
    expect(patched.isChestOpened).toBe(true);
    expect(patched.isNearChest).toBe(false);
    expect(patched.inventory).toEqual([HELD_ITEM, RED_GEM]);
  });

  it('should add to the score when the player takes a gem', () => {
    const patched = patchState(RED_GEM);

    expect(patched.score).toBe(HELD_SCORE + getScoreAmount(RED_GEM));
  });

  it('should add to the ammo when the player takes bullets', () => {
    const patched = patchState(TWO_BULLETS);

    expect(patched.ammo).toBe(HELD_AMMO + getBulletsAmount(TWO_BULLETS));
  });

  it('should add to the stars when the player takes a star', () => {
    const patched = patchState(STAR);

    expect(patched.stars).toBe(HELD_STARS + getStarsAmount(STAR));
  });

  it('should take the player it was handed when it rebuilds the game', () => {
    const player = createState().player;

    const patched = patchTakenItemState({
      state: createState(),
      item: RED_GEM,
      player,
    });

    expect(patched.player).toBe(player);
  });

  it('should not change the game it was handed when it rebuilds it', () => {
    const state = createState();

    patchTakenItemState({ state, item: RED_GEM, player: state.player });

    expect(state).toEqual(createState());
  });
});
