import { describe, expect, it } from 'vitest';

import { createJumpTestState } from './create-jump-test-state';

describe('createJumpTestState', () => {
  it('should hold the left button alone when it builds the game', () => {
    expect(createJumpTestState().input).toEqual({
      isLeft: true,
      isRight: false,
      isJump: false,
    });
  });

  it('should start the level in play with the player alive when it builds the game', () => {
    const state = createJumpTestState();

    expect(state.status).toBe('PLAYING');
    expect(state.player.timers.death).toBeNull();
  });

  it('should build a game of its own each time it is called', () => {
    expect(createJumpTestState()).not.toBe(createJumpTestState());
    expect(createJumpTestState()).toEqual(createJumpTestState());
  });
});
