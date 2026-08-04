import type { GameState } from '../state/game-state';

export interface ReplayPlayback {
  elapsedMs: number;
  index: number;
  state: GameState;
}
