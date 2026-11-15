import { describe, expect, it } from 'vitest';

import { createDyingJumpTestState } from './create-dying-jump-test-state';
import { createJumpTestState } from './create-jump-test-state';

const DYING_SECONDS = 0.5;

describe('createDyingJumpTestState', () => {
  it('should set the death clock running when it builds the game', () => {
    expect(createDyingJumpTestState().player.timers.death).toBe(DYING_SECONDS);
  });

  it('should leave the rest of the game as it was when it builds the game', () => {
    const dying = createDyingJumpTestState();

    expect(dying.input).toEqual(createJumpTestState().input);
    expect(dying.status).toBe(createJumpTestState().status);
  });

  it('should build a game of its own each time it is called', () => {
    expect(createDyingJumpTestState()).not.toBe(createDyingJumpTestState());
    expect(createDyingJumpTestState()).toEqual(createDyingJumpTestState());
  });
});
