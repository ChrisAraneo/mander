import type { GameState } from '../state/game-state';
import type { ReplayPlayback } from './replay-playback';

export const createPlayback = (state: GameState): ReplayPlayback => ({
  elapsedMs: 0,
  index: 0,
  state,
});
