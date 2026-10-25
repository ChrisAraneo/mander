import { PLAYER_HEIGHT, PLAYER_WIDTH } from '@mander/engine';
import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../test/create-render-test-state';
import { computePlayerFocus } from './compute-player-focus';

describe('computePlayerFocus', () => {
  it('should look at the middle of the player when the game is under way', () => {
    const state = createRenderTestState(['.@..', '####']);

    const focus = computePlayerFocus(state);

    expect(focus).toEqual({
      x: state.player.position.x + PLAYER_WIDTH / 2,
      y: state.player.position.y + PLAYER_HEIGHT / 2,
    });
  });

  it('should follow the player when the player has moved', () => {
    const state = createRenderTestState(['.@..', '####']);
    const moved = createRenderTestState(['.@..', '####'], {
      player: { ...state.player, position: { x: 300, y: 20 } },
    });

    const focus = computePlayerFocus(moved);

    expect(focus).toEqual({
      x: 300 + PLAYER_WIDTH / 2,
      y: 20 + PLAYER_HEIGHT / 2,
    });
  });
});
