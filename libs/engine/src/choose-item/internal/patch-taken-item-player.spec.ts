import { DOUBLE_HEART, type Item, RED_GEM, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { getHeartsAmount } from '../../item/get-hearts-amount';
import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createBasePlayerVelocity } from '../../player/create-base-player-velocity';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { patchTakenItemPlayer } from './patch-taken-item-player';

const HELD_HEARTS = 3;
const HELD_TOP_SPEED = 9;
const CARRIED_MOVE_SPEED = 42;

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
  player: {
    ...initial.player,
    hearts: { value: HELD_HEARTS },
    velocity: {
      x: { current: CARRIED_MOVE_SPEED, max: HELD_TOP_SPEED },
      y: { current: 0, max: HELD_TOP_SPEED },
    },
  },
});

const createState = (): GameState =>
  patchChestState(createInitialState(LEVEL, FIRST_LEVEL_INDEX, [HELD_ITEM]));

const patchPlayer = (item: Item): GameState['player'] =>
  patchTakenItemPlayer({
    state: createState(),
    item,
    baseVelocity: createBasePlayerVelocity(),
  }).player;

describe('patchTakenItemPlayer', () => {
  it('should add the hearts the item carries when the player takes a heart', () => {
    const player = patchPlayer(DOUBLE_HEART);

    expect(player.hearts.value).toBe(
      HELD_HEARTS + getHeartsAmount(DOUBLE_HEART),
    );
  });

  it('should leave the hearts alone when the item heals nothing', () => {
    const player = patchPlayer(RED_GEM);

    expect(player.hearts.value).toBe(HELD_HEARTS);
  });

  it('should bring the top speeds back to the base ones when the player takes an item', () => {
    const player = patchPlayer(RED_GEM);

    expect(player.velocity.x.max).toBe(createBasePlayerVelocity().x.max);
    expect(player.velocity.y.max).toBe(createBasePlayerVelocity().y.max);
  });

  it('should keep the speed the player was already going at when they take an item', () => {
    const player = patchPlayer(RED_GEM);

    expect(player.velocity.x.current).toBe(CARRIED_MOVE_SPEED);
  });

  it('should pass the rest of the game and the item on when it rebuilds the player', () => {
    const state = createState();

    const patched = patchTakenItemPlayer({
      state,
      item: RED_GEM,
      baseVelocity: createBasePlayerVelocity(),
    });

    expect(patched.state).toBe(state);
    expect(patched.item).toBe(RED_GEM);
  });

  it('should not change the game it was handed when it rebuilds the player', () => {
    const state = createState();

    patchTakenItemPlayer({
      state,
      item: RED_GEM,
      baseVelocity: createBasePlayerVelocity(),
    });

    expect(state).toEqual(createState());
  });
});
