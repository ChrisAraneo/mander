import type { GameState } from '../state/types/game-state';
import type { ReplayPlayback } from './types/replay-playback';

export const createPlayback = (state: GameState): ReplayPlayback => ({
  elapsedMs: 0,
  index: 0,
  state,
});
