import {
  DOUBLE_HEART,
  type Item,
  RED_GEM,
  STAR,
  TILE_DIRT,
  TWO_BULLETS,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { getBulletsAmount } from '../../item/get-bullets-amount';
import { getHeartsAmount } from '../../item/get-hearts-amount';
import { getScoreAmount } from '../../item/get-score-amount';
import { getStarsAmount } from '../../item/get-stars-amount';
import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createBasePlayerVelocity } from '../../player/create-base-player-velocity';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { patchTakenItem } from './patch-taken-item';

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

const HELD_SCORE = 100;
const HELD_AMMO = 3;
const HELD_STARS = 2;
const HELD_HEARTS = 3;
const HELD_MOVE_SPEED = 42;
const HELD_JUMP_SPEED = -7;
const HELD_TOP_SPEED = 9;

const patchChestState = (initial: GameState): GameState => ({
  ...initial,
  status: 'CHEST',
  isNearChest: true,
  score: HELD_SCORE,
  ammo: HELD_AMMO,
  stars: HELD_STARS,
  player: {
    ...initial.player,
    hearts: { value: HELD_HEARTS },
    velocity: {
      x: { current: HELD_MOVE_SPEED, max: HELD_TOP_SPEED },
      y: { current: HELD_JUMP_SPEED, max: HELD_TOP_SPEED },
    },
  },
});

const createState = (): GameState =>
  patchChestState(createInitialState(LEVEL, FIRST_LEVEL_INDEX, [HELD_ITEM]));

describe('patchTakenItem', () => {
  it('should shut the chest and add the item to the inventory when the player takes it', () => {
    const taken = patchTakenItem(createState(), RED_GEM);

    expect(taken.status).toBe('PLAYING');
    expect(taken.isChestOpened).toBe(true);
    expect(taken.isNearChest).toBe(false);
    expect(taken.inventory).toEqual([HELD_ITEM, RED_GEM]);
  });

  it('should add to the score when the player takes a gem', () => {
    const taken = patchTakenItem(createState(), RED_GEM);

    expect(taken.score).toBe(HELD_SCORE + getScoreAmount(RED_GEM));
  });

  it('should add to the ammo when the player takes bullets', () => {
    const taken = patchTakenItem(createState(), TWO_BULLETS);

    expect(taken.ammo).toBe(HELD_AMMO + getBulletsAmount(TWO_BULLETS));
  });

  it('should add to the stars when the player takes a star', () => {
    const taken = patchTakenItem(createState(), STAR);

    expect(taken.stars).toBe(HELD_STARS + getStarsAmount(STAR));
  });

  it('should add to the hearts when the player takes a heart', () => {
    const taken = patchTakenItem(createState(), DOUBLE_HEART);

    expect(taken.player.hearts.value).toBe(
      HELD_HEARTS + getHeartsAmount(DOUBLE_HEART),
    );
  });

  it('should bring the top speeds back to the base ones when the player takes an item', () => {
    const taken = patchTakenItem(createState(), RED_GEM);

    expect(taken.player.velocity).toEqual({
      x: { current: HELD_MOVE_SPEED, max: createBasePlayerVelocity().x.max },
      y: { current: HELD_JUMP_SPEED, max: createBasePlayerVelocity().y.max },
    });
  });

  it('should leave the game it was handed untouched when the player takes an item', () => {
    const state = createState();

    patchTakenItem(state, RED_GEM);

    expect(state).toEqual(createState());
  });
});
