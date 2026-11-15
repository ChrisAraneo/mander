import { describe, expect, it } from 'vitest';

import type { GameState } from '../../state/types/game-state';
import { createDyingJumpTestState } from '../create-dying-jump-test-state';
import { createJumpTestState } from '../create-jump-test-state';
import { patchQueuedJump } from './patch-queued-jump';

describe('patchQueuedJump', () => {
  it('should hold the jump button and keep the other buttons whatever the player is doing', () => {
    const patched = patchQueuedJump(createDyingJumpTestState());

    expect(patched.input).toEqual({
      isLeft: true,
      isRight: false,
      isJump: true,
    });
  });

  it('should queue a jump when the player is alive in a level being played', () => {
    const state = createJumpTestState();

    const patched = patchQueuedJump(state);

    expect(patched.player).toEqual({
      ...state.player,
      statuses: { ...state.player.statuses, isJumpQueued: true },
    });
  });

  it('should leave the player alone when the player is dying', () => {
    const state = createDyingJumpTestState();

    const patched = patchQueuedJump(state);

    expect(patched.player).toBe(state.player);
  });

  it('should leave the player alone when the chest is open', () => {
    const state: GameState = { ...createJumpTestState(), status: 'CHEST' };

    const patched = patchQueuedJump(state);

    expect(patched.player).toBe(state.player);
  });

  it('should leave the player alone when the level is already complete', () => {
    const state: GameState = { ...createJumpTestState(), status: 'COMPLETE' };

    const patched = patchQueuedJump(state);

    expect(patched.player).toBe(state.player);
  });

  it('should leave the player alone when the game is over', () => {
    const state: GameState = { ...createJumpTestState(), status: 'GAME_OVER' };

    const patched = patchQueuedJump(state);

    expect(patched.player).toBe(state.player);
  });

  it('should leave the game it was handed untouched when the player jumps', () => {
    const state = createJumpTestState();

    patchQueuedJump(state);

    expect(state).toEqual(createJumpTestState());
  });
});
