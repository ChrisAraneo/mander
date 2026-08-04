import { type GameState, PLAYER_HEIGHT, PLAYER_WIDTH } from '@mander/engine';

import type { Focus } from './focus';

export const playerFocus = (state: GameState): Focus => ({
  x: state.player.position.x + PLAYER_WIDTH / 2,
  y: state.player.position.y + PLAYER_HEIGHT / 2,
});
