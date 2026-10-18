import { createInitialState } from '@mander/engine';
import { describe, expect, it } from 'vitest';

import { createRenderTestLevel } from './create-render-test-level';
import { createRenderTestState } from './create-render-test-state';

const ROWS = ['.@..', '####'];

describe('createRenderTestState', () => {
  it('should start the game on the level when no patch is given', () => {
    const state = createRenderTestState(ROWS);

    expect(state).toEqual(
      createInitialState(createRenderTestLevel(ROWS), 0, []),
    );
  });

  it('should lay the patch over the state when a patch is given', () => {
    const state = createRenderTestState(ROWS, { time: 2.5, hasKey: true });

    expect(state.time).toBe(2.5);
    expect(state.hasKey).toBe(true);
  });
});
