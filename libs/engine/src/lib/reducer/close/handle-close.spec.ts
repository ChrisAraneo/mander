import { type Item, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import type { GameState } from '../../types/game-state';
import { handleClose } from './handle-close';

const createTrinket = (id: string): Item => ({
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
  chestItems: [createTrinket('ON_OFFER')],
  hornedEnemyChance: 0,
});

const createChestState = (inventory: Item[] = []): GameState => ({
  ...createInitialState(createChestLevel(), 0, inventory),
  status: 'CHEST',
  isNearChest: true,
});

describe('handleClose', () => {
  it('should hand control back to the player when the chest is open', () => {
    expect(handleClose(createChestState()).status).toBe('PLAYING');
  });

  it('should leave the chest unopened when the player closes it', () => {
    expect(handleClose(createChestState()).isChestOpened).toBe(false);
  });

  it('should leave inventory and score alone when the chest closes', () => {
    const held = createTrinket('HELD');
    const state: GameState = { ...createChestState([held]), score: 100 };
    const closed = handleClose(state);

    expect(closed.inventory).toEqual([held]);
    expect(closed.score).toBe(100);
  });

  it('should leave the player standing by the chest when it closes', () => {
    expect(handleClose(createChestState()).isNearChest).toBe(true);
  });

  it('should leave the player untouched when the chest closes', () => {
    const state = createChestState();

    expect(handleClose(state).player).toBe(state.player);
  });

  it('should leave the given state untouched when the chest closes', () => {
    const state = createChestState();

    handleClose(state);

    expect(state.status).toBe('CHEST');
  });

  it('should leave the state alone when the player is still playing', () => {
    const state: GameState = { ...createChestState(), status: 'PLAYING' };

    expect(handleClose(state)).toBe(state);
  });

  it('should leave the state alone when the run has already ended', () => {
    const lost: GameState = { ...createChestState(), status: 'GAME_OVER' };
    const won: GameState = { ...createChestState(), status: 'COMPLETE' };

    expect(handleClose(lost)).toBe(lost);
    expect(handleClose(won)).toBe(won);
  });
});
