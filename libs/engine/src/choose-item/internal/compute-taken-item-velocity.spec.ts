import {
  DOUBLE_HEART,
  type Item,
  RED_GEM,
  TILE_DIRT,
  TWO_BULLETS,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createBasePlayerVelocity } from '../../player/create-base-player-velocity';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { computeTakenItemVelocity } from './compute-taken-item-velocity';

const HELD_SCORE = 100;
const HELD_AMMO = 3;
const HELD_STARS = 2;
const HELD_HEARTS = 3;
const HELD_TOP_SPEED = 9;

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
  score: HELD_SCORE,
  ammo: HELD_AMMO,
  stars: HELD_STARS,
  player: {
    ...initial.player,
    hearts: { value: HELD_HEARTS },
    velocity: {
      x: { ...initial.player.velocity.x, max: HELD_TOP_SPEED },
      y: { ...initial.player.velocity.y, max: HELD_TOP_SPEED },
    },
  },
});

const createState = (): GameState =>
  patchChestState(createInitialState(LEVEL, FIRST_LEVEL_INDEX, [HELD_ITEM]));

describe('computeTakenItemVelocity', () => {
  it('should work out the base top speeds when the player takes an item', () => {
    const computed = computeTakenItemVelocity({
      state: createState(),
      item: RED_GEM,
    });

    expect(computed.baseVelocity).toEqual(createBasePlayerVelocity());
  });

  it('should pass the rest of the game on when it works out the speeds', () => {
    const state = createState();

    const computed = computeTakenItemVelocity({ state, item: RED_GEM });

    expect(computed.state).toBe(state);
  });

  it('should pass the item on when it works out the speeds', () => {
    const computed = computeTakenItemVelocity({
      state: createState(),
      item: TWO_BULLETS,
    });

    expect(computed.item).toBe(TWO_BULLETS);
  });

  it('should not change the game it was handed when it works out the speeds', () => {
    const state = createState();

    computeTakenItemVelocity({ state, item: DOUBLE_HEART });

    expect(state).toEqual(createState());
  });
});
