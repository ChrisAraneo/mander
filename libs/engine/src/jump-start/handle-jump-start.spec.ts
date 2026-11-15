import { describe, expect, it } from 'vitest';

import type { GameState } from '../state/types/game-state';
import { createDyingJumpTestState } from './create-dying-jump-test-state';
import { createJumpTestState } from './create-jump-test-state';
import { handleJumpStart } from './handle-jump-start';

describe('handleJumpStart', () => {
  it('should change nothing when the jump button is already held', () => {
    const state: GameState = {
      ...createJumpTestState(),
      input: { isLeft: false, isRight: false, isJump: true },
    };

    const started = handleJumpStart(state);

    expect(started).toBe(state);
  });

  it('should hold the jump button and keep the other buttons when the player is alive', () => {
    const started = handleJumpStart(createJumpTestState());

    expect(started.input).toEqual({
      isLeft: true,
      isRight: false,
      isJump: true,
    });
  });

  it('should queue a jump when the player is alive in a level being played', () => {
    const state = createJumpTestState();

    const started = handleJumpStart(state);

    expect(started.player).toEqual({
      ...state.player,
      statuses: { ...state.player.statuses, isJumpQueued: true },
    });
  });

  it('should hold the jump button but leave the player alone when the player is dying', () => {
    const state = createDyingJumpTestState();

    const started = handleJumpStart(state);

    expect(started.input.isJump).toBe(true);
    expect(started.player).toBe(state.player);
  });

  it('should hold the jump button but leave the player alone when the chest is open', () => {
    const state: GameState = { ...createJumpTestState(), status: 'CHEST' };

    const started = handleJumpStart(state);

    expect(started.input.isJump).toBe(true);
    expect(started.player).toBe(state.player);
  });

  it('should hold the jump button but leave the player alone when the level is complete', () => {
    const state: GameState = { ...createJumpTestState(), status: 'COMPLETE' };

    const started = handleJumpStart(state);

    expect(started.input.isJump).toBe(true);
    expect(started.player).toBe(state.player);
  });

  it('should hold the jump button but leave the player alone when the game is over', () => {
    const state: GameState = { ...createJumpTestState(), status: 'GAME_OVER' };

    const started = handleJumpStart(state);

    expect(started.input.isJump).toBe(true);
    expect(started.player).toBe(state.player);
  });

  it('should leave the game it was handed untouched when the player jumps', () => {
    const state = createJumpTestState();

    handleJumpStart(state);

    expect(state).toEqual(createJumpTestState());
  });
});
