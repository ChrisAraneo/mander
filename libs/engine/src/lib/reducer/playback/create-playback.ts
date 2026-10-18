import type { GameState } from '../../types/game-state';
import type { ReplayPlayback } from './types/replay-playback';

export const createPlayback = (state: GameState): ReplayPlayback => ({
  step: 0,
  index: 0,
  state,
});
