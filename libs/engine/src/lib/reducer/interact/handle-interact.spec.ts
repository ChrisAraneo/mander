import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import type { GameState } from '../../types/game-state';
import { handleInteract } from './handle-interact';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.S...', '#####']);

const createState = (): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  score: 500,
  time: 12.4,
  levelTimes: [30],
});

describe('handleInteract', () => {
  it('should open the chest when the player stands by it holding the key', () => {
    const state: GameState = {
      ...createState(),
      isNearChest: true,
      hasKey: true,
    };

    const interacted = handleInteract(state);

    expect(interacted).toEqual({ ...state, status: 'CHEST' });
  });

  it('should open the chest rather than finish the level when the player stands by both holding the key', () => {
    const state: GameState = {
      ...createState(),
      isNearChest: true,
      hasKey: true,
      isNearPortal: true,
    };

    const interacted = handleInteract(state);

    expect(interacted.status).toBe('CHEST');
    expect(interacted.score).toBe(500);
  });

  it('should leave the state alone when the player stands by the chest without the key', () => {
    const state: GameState = { ...createState(), isNearChest: true };

    const interacted = handleInteract(state);

    expect(interacted).toBe(state);
  });

  it('should leave the state alone when the player holds the key away from the chest', () => {
    const state: GameState = { ...createState(), hasKey: true };

    const interacted = handleInteract(state);

    expect(interacted).toBe(state);
  });

  it('should leave the state alone when the player is near nothing', () => {
    const state = createState();

    const interacted = handleInteract(state);

    expect(interacted).toBe(state);
  });

  it('should finish the level when the player stands by the portal', () => {
    const state: GameState = { ...createState(), isNearPortal: true };

    const interacted = handleInteract(state);

    expect(interacted).toEqual({
      ...state,
      status: 'COMPLETE',
      score: 500 + 8800,
      levelTimes: [30, 12.4],
    });
  });

  it('should finish the level when the player stands by the chest without the key and by the portal', () => {
    const state: GameState = {
      ...createState(),
      isNearChest: true,
      isNearPortal: true,
    };

    const interacted = handleInteract(state);

    expect(interacted.status).toBe('COMPLETE');
  });

  it('should leave the state alone when the chest is already open', () => {
    const state: GameState = {
      ...createState(),
      status: 'CHEST',
      isNearChest: true,
      hasKey: true,
      isNearPortal: true,
    };

    const interacted = handleInteract(state);

    expect(interacted).toBe(state);
  });

  it('should leave the state alone when the level is already complete', () => {
    const state: GameState = {
      ...createState(),
      status: 'COMPLETE',
      isNearPortal: true,
    };

    const interacted = handleInteract(state);

    expect(interacted).toBe(state);
  });

  it('should leave the state alone when the game is over', () => {
    const state: GameState = {
      ...createState(),
      status: 'GAME_OVER',
      isNearPortal: true,
    };

    const interacted = handleInteract(state);

    expect(interacted).toBe(state);
  });

  it('should leave the given state unchanged when the player finishes the level', () => {
    const state: GameState = { ...createState(), isNearPortal: true };

    handleInteract(state);

    expect(state).toEqual({ ...createState(), isNearPortal: true });
  });
});
