import { type Item, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameState } from '../../state/types/game-state';
import type { GameLevel } from '../../types/game-level';
import { close } from './close';

const trinket = (id: string): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: { kind: 'NONE' },
});

const chestLevel = (): GameLevel => ({
  seed: 'TEST',
  width: 1,
  height: 1,
  tiles: [[TILE_DIRT]],
  chestItems: [trinket('ON_OFFER')],
  hornedEnemyChance: 0,
});

const openChest = (inventory: Item[] = []): GameState => ({
  ...createInitialState(chestLevel(), 0, inventory),
  status: 'CHEST',
  isNearChest: true,
});

describe('close', () => {
  it('should hand control back to the player when the chest is open', () => {
    expect(close(openChest()).status).toBe('PLAYING');
  });

  it('should leave the chest unopened when the player closes it', () => {
    expect(close(openChest()).isChestOpened).toBe(false);
  });

  it('should leave inventory and score alone when the chest closes', () => {
    const held = trinket('HELD');
    const state: GameState = { ...openChest([held]), score: 100 };
    const closed = close(state);

    expect(closed.inventory).toEqual([held]);
    expect(closed.score).toBe(100);
  });

  it('should leave the player standing by the chest when it closes', () => {
    expect(close(openChest()).isNearChest).toBe(true);
  });

  it('should leave the player untouched when the chest closes', () => {
    const state = openChest();

    expect(close(state).player).toBe(state.player);
  });

  it('should leave the given state untouched when the chest closes', () => {
    const state = openChest();

    close(state);

    expect(state.status).toBe('CHEST');
  });

  it('should leave the state alone when the player is still playing', () => {
    const state: GameState = { ...openChest(), status: 'PLAYING' };

    expect(close(state)).toBe(state);
  });

  it('should leave the state alone when the run has already ended', () => {
    const lost: GameState = { ...openChest(), status: 'GAME_OVER' };
    const won: GameState = { ...openChest(), status: 'COMPLETE' };

    expect(close(lost)).toBe(lost);
    expect(close(won)).toBe(won);
  });
});
