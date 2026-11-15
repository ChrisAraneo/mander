import { describe, expect, it } from 'vitest';

import { FIRST_LEVEL_INDEX } from '../load-level/consts';
import { LEVEL_SCORE_BASE, LEVEL_SCORE_PER_SECOND } from '../score/consts';
import { createInitialState } from '../start/create-initial-state';
import type { GameState } from '../state/types/game-state';
import { createInteractTestLevel } from './create-interact-test-level';
import { handleInteract } from './handle-interact';

const LEVEL = createInteractTestLevel();

const START_SCORE = 500;

const LEVEL_SECONDS = 12.4;

const ROUNDED_SECONDS = 12;

const LEVEL_SCORE = LEVEL_SCORE_BASE - LEVEL_SCORE_PER_SECOND * ROUNDED_SECONDS;

const EARLIER_LEVEL_SECONDS = 30;

const createState = (): GameState => ({
  ...createInitialState(LEVEL, FIRST_LEVEL_INDEX, []),
  score: START_SCORE,
  time: LEVEL_SECONDS,
  levelTimes: [EARLIER_LEVEL_SECONDS],
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

  it('should change nothing when the player stands by the chest without the key', () => {
    const state: GameState = { ...createState(), isNearChest: true };

    const interacted = handleInteract(state);

    expect(interacted).toBe(state);
  });

  it('should change nothing when the player holds the key away from the chest', () => {
    const state: GameState = { ...createState(), hasKey: true };

    const interacted = handleInteract(state);

    expect(interacted).toBe(state);
  });

  it('should change nothing when the player is near nothing', () => {
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
      score: START_SCORE + LEVEL_SCORE,
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

  it('should change nothing when the chest is already open', () => {
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

  it('should change nothing when the level is already complete', () => {
    const state: GameState = {
      ...createState(),
      status: 'COMPLETE',
      isNearPortal: true,
    };

    const interacted = handleInteract(state);

    expect(interacted).toBe(state);
  });

  it('should change nothing when the game is over', () => {
    const state: GameState = {
      ...createState(),
      status: 'GAME_OVER',
      isNearPortal: true,
    };

    const interacted = handleInteract(state);

    expect(interacted).toBe(state);
  });

  it('should leave the game it was handed untouched when the player finishes the level', () => {
    const state: GameState = { ...createState(), isNearPortal: true };

    handleInteract(state);

    expect(state).toEqual({ ...createState(), isNearPortal: true });
  });
});
