import { type Item, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { FIRST_LEVEL_INDEX } from '../load-level/consts';
import { createInitialState } from '../start/create-initial-state';
import type { GameLevel } from '../state/types/game-level';
import type { GameState } from '../state/types/game-state';
import { handleClose } from './handle-close';

const createItem = (id: string): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: { kind: 'NONE' },
});

const createChestLevel = (): GameLevel => ({
  seed: 'TEST',
  width: 1,
  height: 1,
  tiles: [[TILE_DIRT]],
  chestItems: [createItem('ON_OFFER')],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const createChestState = (inventory: Item[] = []): GameState => ({
  ...createInitialState(createChestLevel(), FIRST_LEVEL_INDEX, inventory),
  status: 'CHEST',
  isNearChest: true,
});

const HELD_SCORE = 100;

describe('handleClose', () => {
  it('should hand control back to the player when the chest is open', () => {
    expect(handleClose(createChestState()).status).toBe('PLAYING');
  });

  it('should leave the chest unopened when the player closes it', () => {
    expect(handleClose(createChestState()).isChestOpened).toBe(false);
  });

  it('should leave inventory and score alone when the chest closes', () => {
    const held = createItem('HELD');
    const state: GameState = {
      ...createChestState([held]),
      score: HELD_SCORE,
    };

    const closed = handleClose(state);

    expect(closed.inventory).toEqual([held]);
    expect(closed.score).toBe(HELD_SCORE);
  });

  it('should leave the player standing by the chest when it closes', () => {
    expect(handleClose(createChestState()).isNearChest).toBe(true);
  });

  it('should leave the player untouched when the chest closes', () => {
    const state = createChestState();

    expect(handleClose(state).player).toBe(state.player);
  });

  it('should leave the game it was handed untouched when the chest closes', () => {
    const state = createChestState();

    handleClose(state);

    expect(state.status).toBe('CHEST');
  });

  it('should change nothing when the player is still playing', () => {
    const state: GameState = { ...createChestState(), status: 'PLAYING' };

    expect(handleClose(state)).toBe(state);
  });

  it('should change nothing when the run has already ended', () => {
    const lost: GameState = { ...createChestState(), status: 'GAME_OVER' };
    const won: GameState = { ...createChestState(), status: 'COMPLETE' };

    expect(handleClose(lost)).toBe(lost);
    expect(handleClose(won)).toBe(won);
  });
});
