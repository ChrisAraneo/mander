import { DOUBLE_HEART, type Item, RED_GEM, STAR, TILE_DIRT, TWO_BULLETS, chain } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { createBasePlayerVelocity } from '../../player/create-base-player-velocity';
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
};

const createState = (): GameState =>
  chain(createInitialState(LEVEL, 0, [HELD_ITEM]))
    .thru((initial): GameState => ({
      ...initial,
      status: 'CHEST',
      isNearChest: true,
      score: 100,
      ammo: 3,
      stars: 2,
      player: {
        ...initial.player,
        hearts: { value: 3 },
        velocity: {
          x: { current: 42, max: 9 },
          y: { current: -7, max: 9 },
        },
      },
    }))
    .value();

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

    expect(taken.score).toBe(1600);
  });

  it('should add to the ammo when the player takes bullets', () => {
    const taken = patchTakenItem(createState(), TWO_BULLETS);

    expect(taken.ammo).toBe(7);
  });

  it('should add to the stars when the player takes a star', () => {
    const taken = patchTakenItem(createState(), STAR);

    expect(taken.stars).toBe(3);
  });

  it('should add to the hearts when the player takes a heart', () => {
    const taken = patchTakenItem(createState(), DOUBLE_HEART);

    expect(taken.player.hearts.value).toBe(5);
  });

  it('should bring the top speeds back to the base ones when the player takes an item', () => {
    const taken = patchTakenItem(createState(), RED_GEM);

    expect(taken.player.velocity).toEqual({
      x: { current: 42, max: createBasePlayerVelocity().x.max },
      y: { current: -7, max: createBasePlayerVelocity().y.max },
    });
  });

  it('should leave the given state unchanged when the player takes an item', () => {
    const state = createState();

    patchTakenItem(state, RED_GEM);

    expect(state).toEqual(createState());
  });
});
